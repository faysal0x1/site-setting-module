import SocialLinksField from '@/components/SocialLinksField';
import AppLayout from '@/layouts/app-layout.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function edit() {
    const { sitesetting, permissions, auth } = usePage().props;

    const logoUrl = sitesetting?.logo_url || '';
    const iconUrl = sitesetting?.icon_url || '';

    const initialMedia = {
        logo: logoUrl,
        icon: iconUrl,
    };
    const [previews, setPreviews] = useState(initialMedia);
    const initialMediaRef = useRef(initialMedia);
    const objectUrlsRef = useRef({});

    const { data, setData, post, processing, errors } = useForm({
        logo: null,
        icon: null,
        phone1: sitesetting?.phone1 || '',
        phone2: sitesetting?.phone2 || '',
        email1: sitesetting?.email1 || '',
        email2: sitesetting?.email2 || '',
        company_name: sitesetting?.company_name || '',
        company_address: sitesetting?.company_address || '',
        map_api: sitesetting?.map_api || '',
        social_links: sitesetting?.social_links?.map(link => ({
            platform: link.platform || '',
            url: link.url || '',
            icon: link.icon || '',
            order: link.order ?? 0,
            is_active: link.is_active !== false,
        })) || [],
    });

    const imageFields = [
        {
            name: 'logo',
            label: 'Brand Logo',
            helper: 'Recommended: transparent PNG/SVG, max 2MB.',
        },
        {
            name: 'icon',
            label: 'Favicon / Square Icon',
            helper: 'Recommended: 1:1 ratio (e.g. 256x256), max 1MB.',
        },
    ];

    const fields = [
        {
            name: 'phone1',
            label: 'Phone 1',
            type: 'tel',
            required: false,
        },
        {
            name: 'phone2',
            label: 'Phone 2',
            type: 'tel',
            required: false,
        },
        {
            name: 'email1',
            label: 'Email 1',
            type: 'email',
            required: false,
        },
        {
            name: 'email2',
            label: 'Email 2',
            type: 'email',
            required: false,
        },
        {
            name: 'company_name',
            label: 'Company Name',
            type: 'text',
            required: false,
        },
        {
            name: 'company_address',
            label: 'Company Address',
            type: 'textarea',
            required: false,
        },
        {
            name: 'map_api',
            label: 'Map API',
            type: 'text',
            required: false,
        },
    ];

    const updatePreview = (field, value) => {
        setPreviews((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const revokePreview = (field) => {
        if (objectUrlsRef.current[field]) {
            URL.revokeObjectURL(objectUrlsRef.current[field]);
            delete objectUrlsRef.current[field];
        }
    };

    const handleImageChange = (field) => (event) => {
        const file = event.target.files?.[0] || null;
        setData(field, file);

        revokePreview(field);

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            objectUrlsRef.current[field] = objectUrl;
            updatePreview(field, objectUrl);
        } else {
            updatePreview(field, initialMediaRef.current[field] || '');
        }
    };

    const resetImageField = (field) => {
        revokePreview(field);
        setData(field, null);
        updatePreview(field, initialMediaRef.current[field] || '');
    };

    useEffect(() => {
        const nextMedia = {
            logo: logoUrl,
            icon: iconUrl,
        };

        initialMediaRef.current = nextMedia;
        setPreviews(nextMedia);
    }, [logoUrl, iconUrl]);

    useEffect(() => {
        return () => {
            Object.values(objectUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare data with social_links array properly formatted
        const submitData = {
            ...data,
            social_links: data.social_links || [],
        };

        post(route('site-setting.update', sitesetting.id), {
            data: submitData,
            forceFormData: true,
            onSuccess: () => {
                toast.success('SiteSetting updated successfully!');
            },
            onError: (errors) => {
                toast.error('Failed to update SiteSetting. Please check the form for errors.');
            },
        });
    };

    const breadcrumbs = [
        {
            title: 'Edit SiteSetting',
            href: '/sitesetting',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit SiteSetting" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit SiteSetting</CardTitle>
                            <CardDescription>Update site setting with dynamic social links</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                                <div className="grid grid-cols-1 gap-6">
                                    {imageFields.map((field) => (
                                        <div key={field.name} className="space-y-3">
                                            <Label htmlFor={field.name}>{field.label}</Label>
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                <div className="w-32 h-32 rounded-xl border border-dashed border-slate-300/40 dark:border-slate-700/60 bg-slate-100/40 dark:bg-slate-800/40 flex items-center justify-center overflow-hidden">
                                                    {previews[field.name] ? (
                                                        <img
                                                            src={previews[field.name]}
                                                            alt={`${field.label} preview`}
                                                            className="object-contain w-full h-full"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-slate-500 text-center px-2">
                                                            No {field.label.toLowerCase()} selected
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <Input
                                                        id={field.name}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange(field.name)}
                                                        className={errors[field.name] ? 'border-red-500' : ''}
                                                    />
                                                    <p className="text-xs text-slate-500">
                                                        {field.helper}
                                                    </p>
                                                    {previews[field.name] && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => resetImageField(field.name)}
                                                        >
                                                            Reset {field.label}
                                                        </Button>
                                                    )}
                                                    {errors[field.name] && (
                                                        <p className="text-sm text-red-500">{errors[field.name]}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {fields.map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <Label htmlFor={field.name}>
                                                {field.label}
                                                {field.required && <span className="text-red-500 ml-1">*</span>}
                                            </Label>
                                            {field.type === 'textarea' ? (
                                                <Textarea
                                                    id={field.name}
                                                    value={data[field.name] || ''}
                                                    onChange={(e) => setData(field.name, e.target.value)}
                                                    placeholder={field.placeholder}
                                                    className={errors[field.name] ? 'border-red-500' : ''}
                                                />
                                            ) : (
                                                <Input
                                                    id={field.name}
                                                    type={field.type}
                                                    value={data[field.name] || ''}
                                                    onChange={(e) => setData(field.name, e.target.value)}
                                                    placeholder={field.placeholder}
                                                    className={errors[field.name] ? 'border-red-500' : ''}
                                                />
                                            )}
                                            {errors[field.name] && (
                                                <p className="text-sm text-red-500">{errors[field.name]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t">
                                    <SocialLinksField
                                        value={data.social_links || []}
                                        onChange={(links) => setData('social_links', links)}
                                        errors={errors}
                                    />
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update SiteSetting'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
