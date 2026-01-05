import AppLayout from '@/layouts/app-layout.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import { Edit, ExternalLink, Globe } from 'lucide-react';

export default function show() {
    const { sitesetting } = usePage().props;

    const fields = [
        { name: 'logo', label: 'Logo', value: sitesetting?.logo },
        { name: 'icon', label: 'Icon', value: sitesetting?.icon },
        { name: 'phone1', label: 'Phone 1', value: sitesetting?.phone1 },
        { name: 'phone2', label: 'Phone 2', value: sitesetting?.phone2 },
        { name: 'email1', label: 'Email 1', value: sitesetting?.email1 },
        { name: 'email2', label: 'Email 2', value: sitesetting?.email2 },
        { name: 'company_name', label: 'Company Name', value: sitesetting?.company_name },
        { name: 'company_address', label: 'Company Address', value: sitesetting?.company_address },
        { name: 'map_api', label: 'Map API', value: sitesetting?.map_api },
    ];

    const socialLinks = sitesetting?.social_links || sitesetting?.socialLinks || [];

    const breadcrumbs = [
        {
            title: 'SiteSetting',
            href: '/sitesetting',
        },
        {
            title: 'View Details',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SiteSetting Details" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>SiteSetting Details</CardTitle>
                                    <CardDescription>View site setting information and social links</CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href={route('site-setting.edit', sitesetting?.id)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {fields.map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                {field.label}
                                            </label>
                                            <div className="text-sm font-medium">
                                                {field.value || (
                                                    <span className="text-muted-foreground italic">Not set</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                                {socialLinks.length > 0 ? (
                                    <div className="space-y-3">
                                        {socialLinks.map((link, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 border rounded-lg bg-card"
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-5 w-5 text-muted-foreground" />
                                                        <div>
                                                            <div className="font-medium">{link.platform}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {link.url}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {link.icon && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Icon: {link.icon}
                                                        </Badge>
                                                    )}
                                                    {link.is_active !== false ? (
                                                        <Badge variant="default" className="text-xs">
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline" className="text-xs">
                                                        Order: {link.order ?? index}
                                                    </Badge>
                                                    {link.url && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                            className="h-8"
                                                        >
                                                            <a
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No social links added yet.</p>
                                    </div>
                                )}
                            </div>

                            {/* Timestamps */}
                            <div className="pt-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label className="text-muted-foreground">Created At</label>
                                        <div className="font-medium">
                                            {sitesetting?.created_at
                                                ? new Date(sitesetting.created_at).toLocaleString()
                                                : 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-muted-foreground">Updated At</label>
                                        <div className="font-medium">
                                            {sitesetting?.updated_at
                                                ? new Date(sitesetting.updated_at).toLocaleString()
                                                : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
