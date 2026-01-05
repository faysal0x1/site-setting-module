<?php

namespace App\Modules\SiteSetting\Http\Controllers;

use App\Helpers\QueryBuilderHelper;
use App\Http\Controllers\Controller;
use App\Modules\SiteSetting\Http\Requests\SiteSettingStoreRequest;
use App\Modules\SiteSetting\Http\Requests\SiteSettingUpdateRequest;
use App\Modules\SiteSetting\Models\SiteSetting;
use App\Modules\SiteSetting\Repositories\SiteSettingRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function __construct(
        private readonly SiteSettingRepository $sitesettingRepository
    ) {}

    /**
     * Display a listing of sitesettings.
     */
    public function index(Request $request): Response
    {
        $sitesettings = $this->sitesettingRepository->paginate($request);

        return Inertia::render('sitesetting/index', [
            'sitesettings' => $sitesettings,
            'filters' => QueryBuilderHelper::filters($request),
        ]);
    }

    /**
     * Show the form for creating a new sitesetting.
     * If one already exists, redirect to edit.
     */
    public function create(): Response|RedirectResponse
    {
        $existing = $this->sitesettingRepository->getOrCreate();

        // If site setting already exists, redirect to edit
        if ($existing && $existing->id) {
            return redirect()->route('site-setting.edit', $existing->id);
        }

        return Inertia::render('sitesetting/create');
    }

    /**
     * Store a newly created sitesetting in storage.
     */
    public function store(SiteSettingStoreRequest $request): RedirectResponse
    {
        try {
            $payload = $this->filterPayload($request->validated());
            $siteSetting = $this->sitesettingRepository->create($payload);
            $this->syncMedia($siteSetting, $request);

            return success_route('site-setting.index', 'SiteSetting created successfully.');
        } catch (\Exception $e) {
            return error_route('site-setting.index', 'Failed to create sitesetting: '.$e->getMessage());
        }
    }

    /**
     * Display the specified sitesetting.
     * Uses singleton pattern - shows the single site setting.
     */
    public function show(int $id): Response
    {
        // Always get or create the single site setting (singleton pattern)
        $sitesetting = $this->sitesettingRepository->getOrCreate();

        if (! $sitesetting) {
            error_response('SiteSetting not found', 404);
        }

        // Convert social links to array format for frontend
        $sitesetting->social_links = $sitesetting->socialLinks ?? [];

        return Inertia::render('sitesetting/show', [
            'sitesetting' => $sitesetting,
        ]);
    }

    /**
     * Show the form for editing the specified sitesetting.
     * Always gets or creates the single site setting (singleton pattern).
     */
    public function edit(int $id): Response
    {
        // Always get or create the single site setting (ignore the ID parameter for singleton)
        $sitesetting = $this->sitesettingRepository->getOrCreate();

        if (! $sitesetting) {
            error_response('SiteSetting not found', 404);
        }

        // Convert social links to array format for frontend
        $sitesetting->social_links = $sitesetting->socialLinks ?? [];

        return Inertia::render('sitesetting/edit', [
            'sitesetting' => $sitesetting,
        ]);
    }

    /**
     * Update the specified sitesetting in storage.
     * Uses singleton pattern - updates the single site setting regardless of ID.
     */
    public function update(SiteSettingUpdateRequest $request, int $id): RedirectResponse
    {
        try {
            // Get the single site setting (singleton pattern)
            $sitesetting = $this->sitesettingRepository->getOrCreate();

            // Update using the singleton's ID
            $payload = $this->filterPayload($request->validated());
            $siteSetting = $this->sitesettingRepository->update($payload, $sitesetting->id);
            $this->syncMedia($siteSetting, $request);

            return success_route('site-setting.index', 'SiteSetting updated successfully.');

        } catch (\Exception $e) {
            return error_route('site-setting.index', 'Failed to update sitesetting: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified sitesetting from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $this->sitesettingRepository->delete($id);

            return success_route('site-setting.index', 'SiteSetting deleted successfully.');
        } catch (\Exception $e) {
            return error_route('site-setting.index', 'Failed to delete sitesetting: '.$e->getMessage());
        }
    }

    /**
     * Filter out file uploads from the payload handled by the repository layer.
     */
    protected function filterPayload(array $data): array
    {
        unset($data['logo'], $data['icon']);

        return $data;
    }

    /**
     * Sync logo and icon uploads using Spatie media library.
     */
    protected function syncMedia(SiteSetting $siteSetting, Request $request): void
    {
        if ($request->hasFile('logo')) {
            $siteSetting->clearMediaCollection('logo');
            $siteSetting->addMediaFromRequest('logo')
                ->usingName('Site Logo')
                ->toMediaCollection('logo');
        }

        if ($request->hasFile('icon')) {
            $siteSetting->clearMediaCollection('icon');
            $siteSetting->addMediaFromRequest('icon')
                ->usingName('Site Icon')
                ->toMediaCollection('icon');
        }
    }
}

