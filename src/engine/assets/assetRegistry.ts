/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssetContract, AssetValidationResult } from '../../types/world';
import { AssetQAValidator } from '../qaValidator';
import { A0_SovereignCitadelAsset } from './A0_SovereignCitadel';
import { A0_PlanetaryGatewayAsset } from './A0_PlanetaryGateway';
import { Tech_KernelPyramidAsset } from './Tech_KernelPyramid';
import { Tech_ComputationalObeliskAsset } from './Tech_ComputationalObelisk';
import { Life_FrameworkSanctuaryAsset } from './Life_FrameworkSanctuary';
import { Life_ModularCampusAsset } from './Life_ModularCampus';
import { Biz_SolarpunkFactoryAsset } from './Biz_SolarpunkFactory';
import { Biz_LogisticsHubAsset } from './Biz_LogisticsHub';

export const ALL_CANONICAL_ASSETS: AssetContract[] = [
  A0_SovereignCitadelAsset,
  A0_PlanetaryGatewayAsset,
  Tech_KernelPyramidAsset,
  Tech_ComputationalObeliskAsset,
  Life_FrameworkSanctuaryAsset,
  Life_ModularCampusAsset,
  Biz_SolarpunkFactoryAsset,
  Biz_LogisticsHubAsset
];

export const ASSET_MAP: Record<string, AssetContract> = {};
ALL_CANONICAL_ASSETS.forEach(a => {
  ASSET_MAP[a.id] = a;
});

export interface BatchGenerationProgress {
  assetId: string;
  status: 'QUEUED' | 'GENERATING' | 'VALIDATING' | 'COMPLETED' | 'FAILED';
  result?: AssetValidationResult;
  durationMs?: number;
}

/**
 * Orchestrates Tiny Town / Box Yard style bounded parallel generation.
 * Limits concurrent worker tasks to max 3 concurrent jobs.
 */
export async function runBoundedParallelGeneration(
  assets: AssetContract[] = ALL_CANONICAL_ASSETS,
  maxConcurrency = 3,
  onProgress?: (progressMap: Record<string, BatchGenerationProgress>) => void
): Promise<Record<string, AssetValidationResult>> {
  const progressMap: Record<string, BatchGenerationProgress> = {};
  const results: Record<string, AssetValidationResult> = {};

  assets.forEach(a => {
    progressMap[a.id] = { assetId: a.id, status: 'QUEUED' };
  });
  onProgress?.({ ...progressMap });

  const queue = [...assets];
  const executing = new Set<Promise<void>>();

  while (queue.length > 0 || executing.size > 0) {
    while (queue.length > 0 && executing.size < maxConcurrency) {
      const asset = queue.shift()!;
      progressMap[asset.id].status = 'GENERATING';
      onProgress?.({ ...progressMap });

      const startTime = performance.now();
      const task = (async () => {
        // Small deterministic micro-tick to yield thread and simulate worker isolation
        await new Promise(r => setTimeout(r, 60));
        progressMap[asset.id].status = 'VALIDATING';
        onProgress?.({ ...progressMap });

        await new Promise(r => setTimeout(r, 40));
        const validation = AssetQAValidator.validate(asset);
        results[asset.id] = validation;

        const duration = Math.round(performance.now() - startTime);
        progressMap[asset.id] = {
          assetId: asset.id,
          status: validation.passed ? 'COMPLETED' : 'FAILED',
          result: validation,
          durationMs: duration
        };
        onProgress?.({ ...progressMap });
      })().finally(() => {
        executing.delete(task);
      });

      executing.add(task);
    }

    if (executing.size > 0) {
      await Promise.race(executing);
    }
  }

  return results;
}
