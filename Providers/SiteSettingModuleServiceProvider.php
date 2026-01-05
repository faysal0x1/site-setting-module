<?php

namespace App\Modules\SiteSetting\Providers;

use App\Modules\SiteSetting\Repositories\SiteSettingRepository;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;

class SiteSettingModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(SiteSettingRepository::class, function ($app) {
            return new SiteSettingRepository(new \App\Modules\SiteSetting\Models\SiteSetting());
        });
        $this->app->alias(SiteSettingRepository::class, 'modules.site-setting.repository');
    }

    public function boot(): void
    {
        $enabled = (bool) (Config::get('modules.site-setting.enabled', true));
        if (! $enabled) {
            return;
        }

        // Routes are loaded from routes/admin_new.php
        // $this->loadRoutesFrom(__DIR__ . '/../routes/admin.php');
        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        // Publish JSX views
        $this->publishes([
            __DIR__ . '/../resources/js/pages/sitesetting' => resource_path('js/pages/sitesetting'),
        ], 'site-setting-views');
    }
}

