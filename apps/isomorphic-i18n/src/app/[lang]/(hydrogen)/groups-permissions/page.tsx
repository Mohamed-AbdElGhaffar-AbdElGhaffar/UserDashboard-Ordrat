// import { usersData } from '@/data/users-data';
import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/roles-permissions/roles-grid';
import UsersTable from '@/app/shared/roles-permissions/users-table';
import CreateRole from '@/app/shared/roles-permissions/create-role';
import axios from 'axios';
import { UserShop } from '@/data/users-data';
import { RoleServerExist } from '@/app/components/ui/roleServerExist/RoleServerExist';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import { API_BASE_URL } from '@/config/base-url';
import { metaObject } from '@/config/site.config';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? ' صلاحيات المستخدمين | تحكم كامل في صلاحيات فريقك'
        : 'User Permissions | Full Access Control for Your Team',
      lang,
      undefined,
      lang === 'ar'
        ? 'أنشئ مجموعات وحدد صلاحيات دقيقة لأعضاء فريق العمل وفقًا للأدوار.'
        : 'Create groups and assign specific permissions for team members based on their roles.'
    ),
  };
}
async function fetchGroups(lang: string, shopId: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/Group/GetAllShopGroups/shopId?shopId=${shopId}`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function fetchUsersData(lang: string, shopId: string) {
  try {
    const response = await axios.get(
      `/api/Employee/GetAll/${shopId}`, {
      params: { PageNumber: 1, PageSize: 5 },
      headers: { 'Accept-Language': lang },
    }
    );

    const apiData = response.data;

    const transformedUsers: UserShop[] = apiData.entities.map((user: any) => ({
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      phoneNumber: user.phoneNumber,
      createdAt: new Date(user.createdAt),
      groups: user.groups?.map((group: any) => group.name) || [],
    }));

    return transformedUsers;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}


async function getBranches(lang: string, shopId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Branch/GetByShopId/${shopId}`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch Branches');
    const data = await res.json();

    return data.map((branch: any) => ({
      label: branch.name,
      value: branch.id
    }));
  } catch (error) {
    console.error('Error fetching Branches:', error);
    return [];
  }
}

export default async function BlankPage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  const cookiebranches = GetCookiesServer('branches') as string;
  const cookiesBranches = JSON.parse(cookiebranches);
  const branches = cookiesBranches.map((branch: any) => ({
    label: lang == 'ar' ? branch.nameAr : branch.nameEn,
    value: branch.id
  }))
  const groups = await fetchGroups(lang, shopId as string);
  if (lang === 'ar') {
    const groupsRoles = await fetchGroups('en', shopId as string);
    for (const group of groups) {
      const matching = groupsRoles.find((gr: any) => gr.id === group.id);
      if (matching) {
        group.roles = matching.roles;
      }
    }
  }
  const usersData = await fetchUsersData(lang, shopId as string);
  const groupOptions: { value: string, label: string }[] = groups.map((group: any) => ({
    value: group.id,
    label: group.name,
  }));
  // const branches = await getBranches(lang, shopId as string);
  console.log("groups: ", groups);

  const pageHeader = {
    title: lang == 'ar' ? 'صلاحيات المستخدمين' : 'User Permissions',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang == 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang == 'ar' ? 'صلاحيات المستخدمين' : 'User Permissions',
      },
    ],
  };
  console.log("groups1: ", groups);
  const viewUsersData = RoleServerExist([
    'GetAllEmployee',
  ]);
  const viewShopGroups = RoleServerExist([
    'GetAllShopGroups',
  ]);
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        {/* <ModalButton customSize='700px' label={lang =="ar"?"إضافة جروب جديد":"Add New Group"} view={<CreateRole lang={lang}/>} /> */}
      </PageHeader>
      {viewShopGroups && (
        <RolesGrid lang={lang} groups={groups} />
      )}
      {viewUsersData && (
        <UsersTable usersData={usersData || []} lang={lang} groupOptions={groupOptions} branchOption={branches} />
      )}
    </>
  );
}
