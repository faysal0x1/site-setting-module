<?php

namespace App\Modules\SiteSetting\Repositories;

use App\Modules\SiteSetting\Models\SiteSetting;
use App\Modules\SiteSetting\Models\SocialLink;
use App\Modules\Cache\Services\SmartCacheService;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class SiteSettingRepository extends BaseRepository
{
    public function __construct(SiteSetting $model)
    {
        parent::__construct($model);
    }

    protected function getSearchableFields(): array
    {
        return ['company_name', 'email1', 'email2', 'phone1', 'phone2', 'created_at'];
    }

    protected function getSortableFields(): array
    {
        return ['logo', 'icon', 'phone1', 'phone2', 'email1', 'email2', 'company_name', 'company_address', 'map_api', 'created_at'];
    }

    /**
     * Paginate site settings with social links count.
     */
    public function paginate(Request $request, array $columns = ['*']): LengthAwarePaginator
    {
        $query           = $this->model->query();
        $params          = $request->isMethod('post') ? $request->all() : $request->query();
        $combinedRequest = new Request($params);

        // Add social links count
        $query->withCount('socialLinks');

        $query = \App\Helpers\QueryBuilderHelper::apply(
            $combinedRequest,
            $query,
            $this->getSearchableFields(),
            $this->getSortableFields()
        );

        $paginator = \App\Helpers\QueryBuilderHelper::paginate($combinedRequest, $query);

        // Transform to include social_links_count
        $paginator->getCollection()->transform(function ($item) {
            $item->social_links_count = $item->social_links_count ?? 0;
            return $item;
        });

        return $paginator;
    }

    /**
     * Get or create the single site setting (singleton pattern).
     */
    public function getOrCreate(): Model
    {
        $siteSetting = $this->model->first();

        if (!$siteSetting) {
            $siteSetting = $this->model->create([]);
        }

        return $siteSetting->load(['socialLinks', 'media']);
    }

    /**
     * Create or update the single site setting with social links (singleton pattern).
     */
    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            // Check if a site setting already exists
            $siteSetting = $this->model->first();

            // Extract social links from data
            $socialLinks = $data['social_links'] ?? [];
            unset($data['social_links']);

            if ($siteSetting) {
                // Update existing site setting
                $siteSetting->update($data);

                // Delete existing social links
                $siteSetting->socialLinks()->delete();
            } else {
                // Create new site setting
                $siteSetting = $this->model->create($data);
            }

            // Create social links if provided
            if (!empty($socialLinks)) {
                foreach ($socialLinks as $index => $socialLink) {
                    if (!empty($socialLink['platform']) && !empty($socialLink['url'])) {
                        $siteSetting->socialLinks()->create([
                            'platform' => $socialLink['platform'],
                            'url' => $socialLink['url'],
                            'icon' => $socialLink['icon'] ?? null,
                            'order' => $socialLink['order'] ?? $index,
                            'is_active' => $socialLink['is_active'] ?? true,
                        ]);
                    }
                }
            }

            SmartCacheService::forget('static', 'site_settings');

            return $siteSetting->load('socialLinks');
        });
    }

    /**
     * Update a site setting with social links.
     */
    public function update(array $data, int $id): Model
    {
        return DB::transaction(function () use ($data, $id) {
            $siteSetting = $this->model->find($id);

            if (!$siteSetting) {
                throw new \Exception('SiteSetting not found');
            }

            // Extract social links from data
            $socialLinks = $data['social_links'] ?? [];
            unset($data['social_links']);

            // Update the site setting
            $siteSetting->update($data);

            // Delete existing social links
            $siteSetting->socialLinks()->delete();

            // Create new social links if provided
            if (!empty($socialLinks)) {
                foreach ($socialLinks as $index => $socialLink) {
                    if (!empty($socialLink['platform']) && !empty($socialLink['url'])) {
                        $siteSetting->socialLinks()->create([
                            'platform' => $socialLink['platform'],
                            'url' => $socialLink['url'],
                            'icon' => $socialLink['icon'] ?? null,
                            'order' => $socialLink['order'] ?? $index,
                            'is_active' => $socialLink['is_active'] ?? true,
                        ]);
                    }
                }
            }

            SmartCacheService::forget('static', 'site_settings');

            return $siteSetting->load('socialLinks');
        });
    }

    /**
     * Find a site setting with social links.
     */
    public function find(int $id, array $columns = ['*']): ?Model
    {
        return $this->model->with('socialLinks')->find($id);
    }

    public function delete(int $id): bool
    {
        $deleted = parent::delete($id);

        if ($deleted) {
            SmartCacheService::forget('static', 'site_settings');
        }

        return $deleted;
    }
}

