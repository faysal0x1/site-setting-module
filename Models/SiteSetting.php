<?php

namespace App\Modules\SiteSetting\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class SiteSetting extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $table = 'site_settings';

    protected $fillable = [
        'logo',
        'icon',
        'phone1',
        'phone2',
        'email1',
        'email2',
        'company_name',
        'company_address',
        'map_api',
    ];

    protected $casts = [
        // Add your casts here
    ];

    protected $appends = [
        'logo_url',
        'icon_url',
    ];

    /**
     * Get the social links for this site setting.
     */
    public function socialLinks(): HasMany
    {
        return $this->hasMany(SocialLink::class)->orderBy('order');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('logo')->singleFile();
        $this->addMediaCollection('icon')->singleFile();
    }

    public function getLogoUrlAttribute(): ?string
    {
        $mediaUrl = $this->getFirstMediaUrl('logo');

        if (! empty($mediaUrl)) {
            return $mediaUrl;
        }

        return $this->attributes['logo'] ?? null;
    }

    public function getIconUrlAttribute(): ?string
    {
        $mediaUrl = $this->getFirstMediaUrl('icon');

        if (! empty($mediaUrl)) {
            return $mediaUrl;
        }

        return $this->attributes['icon'] ?? $this->logo_url;
    }
}
