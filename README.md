# Site Setting Module

Encapsulates site settings (contact info, social links, etc.) as a reusable Laravel module.

## Installation

```
composer require nwidart/laravel-modules
composer require joshbrw/laravel-module-installer
composer require faysal0x1/site-setting-module
php artisan module:enable SiteSetting
php artisan migrate
php artisan vendor:publish --tag=site-setting-views --force
php artisan optimize:clear
```

## Features
- Repository binding (`modules.site-setting.repository`)
- JSX admin pages published via `site-setting-views`
- Migrations for business info and social links

## License
MIT
