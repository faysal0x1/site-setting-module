// resources/js/Pages/sitesetting/index.jsx
import ListingPage from '@/components/ListingPage';
import { column, createSerialColumn } from '@/utils/tableUtils';
import { usePage } from '@inertiajs/react';
import ActionsDropdown from '@/components/ActionsDropdown';

export default function SiteSetting() {
    const { sitesettings, filters = {}, auth } = usePage().props;

    const breadcrumbs = [
        {
            title: 'SiteSetting',
            href: '/sitesetting',
        },
    ];

    const columns = [
        createSerialColumn('Serial'),
        column('company_name', 'Company Name', (item) => (
            <div className="font-medium">{item.company_name || 'N/A'}</div>
        )),
        column('email1', 'Email 1', (item) => (
            <div className="font-medium">{item.email1 || 'N/A'}</div>
        )),
        column('phone1', 'Phone 1', (item) => (
            <div className="font-medium">{item.phone1 || 'N/A'}</div>
        )),
        column('social_links_count', 'Social Links', (item) => {
            const count = item.social_links_count || item.social_links?.length || 0;
            return (
                <div className="font-medium">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {count}
                    </span>
                </div>
            );
        }),
        column('actions', 'Actions', (item) => (
            <ActionsDropdown
                item={item}
                actions={[
                    {
                        type: 'view',
                        label: 'View',
                        route: (id) => route('site-setting.show', id),
                    },
                    {
                        type: 'edit',
                        label: 'Edit',
                        route: (id) => route('site-setting.edit', id),
                    },
                    {
                        type: 'delete',
                        label: 'Delete',
                        route: (id) => route('site-setting.destroy', id),
                        method: 'delete',
                    },
                ]}
            />
        )),
    ];

    return (
        <ListingPage
            title="SiteSetting"
            data={sitesettings}
            filters={filters}
            currentUser={auth.user}
            resourceName="site-setting"
            breadcrumbs={breadcrumbs}
            columns={columns}
            createButtonText="New SiteSetting"
        />
    );
}
