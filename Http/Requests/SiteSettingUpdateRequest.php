<?php

namespace App\Modules\SiteSetting\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SiteSettingUpdateRequest extends FormRequest
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
            'logo' => 'sometimes|nullable|image|max:2048',
            'icon' => 'sometimes|nullable|image|max:1024',
            'phone1' => 'sometimes|nullable|string|regex:/^[0-9+\-\s()]+$/',
            'phone2' => 'sometimes|nullable|string|regex:/^[0-9+\-\s()]+$/',
            'email1' => 'sometimes|nullable|email',
            'email2' => 'sometimes|nullable|email',
            'company_name' => 'sometimes|nullable|string',
            'company_address' => 'sometimes|nullable|string',
            'map_api' => 'sometimes|nullable|string',
            'social_links' => 'sometimes|nullable|array',
            'social_links.*.platform' => 'required_with:social_links|string|max:255',
            'social_links.*.url' => 'required_with:social_links|url|max:500',
            'social_links.*.icon' => 'nullable|string|max:255',
            'social_links.*.order' => 'nullable|integer|min:0',
            'social_links.*.is_active' => 'nullable|boolean',
        ];
    }
}

