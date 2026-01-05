import SocialLinksField from '@/components/SocialLinksField';
import AppLayout from '@/layouts/app-layout.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function create() {
    const { permissions, auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        logo: '',
        icon: '',
        phone1: '',
        phone2: '',
        email1: '',
        email2: '',
        company_name: '',
        company_address: '',
        map_api: '',
        social_links: [],
    });

    const fields = [
        {
            name: 'logo',
            label: 'Logo',
            type: 'text',
            required: false,
        },
        {
            name: 'icon',
            label: 'Icon',
            type: 'text',
            required: false,
        },
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare data with social_links array properly formatted
        const submitData = {
            ...data,
            social_links: data.social_links || [],
        };

        post(route('site-setting.store'), {
            data: submitData,
            onSuccess: () => {
                toast.success('SiteSetting created successfully!');
            },
            onError: (errors) => {
                toast.error('Failed to create SiteSetting. Please check the form for errors.');
            },
        });
    };

    const breadcrumbs = [
        {
            title: 'Create SiteSetting',
            href: '/sitesetting',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create SiteSetting" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New SiteSetting</CardTitle>
                            <CardDescription>Add a new site setting with dynamic social links</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                        {processing ? 'Creating...' : 'Create SiteSetting'}
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
