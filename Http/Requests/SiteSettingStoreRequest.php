<?php

namespace App\Modules\SiteSetting\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SiteSettingStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'logo' => 'nullable|image|max:2048',
            'icon' => 'nullable|image|max:1024',
            'phone1' => 'nullable|string|regex:/^[0-9+\-\s()]+$/',
            'phone2' => 'nullable|string|regex:/^[0-9+\-\s()]+$/',
            'email1' => 'nullable|email',
            'email2' => 'nullable|email',
            'company_name' => 'nullable|string',
            'company_address' => 'nullable|string',
            'map_api' => 'nullable|string',
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'required_with:social_links|string|max:255',
            'social_links.*.url' => 'required_with:social_links|url|max:500',
            'social_links.*.icon' => 'nullable|string|max:255',
            'social_links.*.order' => 'nullable|integer|min:0',
            'social_links.*.is_active' => 'nullable|boolean',
        ];
    }
}

