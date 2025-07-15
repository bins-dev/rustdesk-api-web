import { createRouter, createWebHashHistory } from "vue-router";

const constantRoutes = [
  {
    path: "/",
    name: "RustDesk",
    redirect: "/my",
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "Login" },
    component: () => import("@/views/login/login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    meta: { title: "Register" },
    component: () => import("@/views/register/index.vue"),
  },
  {
    path: "/404",
    component: () => import("@/views/error_page/404.vue"),
    hidden: true,
  },
  {
    path: "/oauth/:code",
    meta: { title: "OauthLogin" },
    component: () => import("@/views/oauth/login.vue"),
    hidden: true,
  },
  {
    path: "/oauth/bind/:code",
    meta: { title: "OauthBind" },
    component: () => import("@/views/oauth/bind.vue"),
    hidden: true,
  },
];

export const asyncRoutes = [
  {
    path: "/",
    name: "RustDesk",
    redirect: "/my",
  },
  {
    path: "/my",
    name: "My",
    redirect: "/my/info",
    meta: { title: "My", icon: "UserFilled" },
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "info",
        name: "MyInfo",
        meta: { title: "Userinfo", icon: "User" /*keepAlive: true*/ },
        component: () => import("@/views/my/info.vue"),
      },
      {
        path: "peer",
        name: "MyPeer",
        meta: { title: "MyPeer", icon: "Monitor" /*keepAlive: true*/ },
        component: () => import("@/views/my/peer/index.vue"),
      },
      {
        path: "address_book_manage",
        name: "MyAddressBookManage",
        meta: {
          title: "AddressBookManage",
          icon: "Collection" /*keepAlive: true*/,
        },
        component: () => import("@/views/my/address_book/manage.vue"),
      },
      {
        path: "address_book",
        name: "MyAddressBook",
        meta: { title: "AddressBooks", icon: "Notebook" /*keepAlive: true*/ },
        component: () => import("@/views/my/address_book/index.vue"),
      },
      {
        path: "tag",
        name: "MyTag",
        meta: { title: "Tags", icon: "CollectionTag" /*keepAlive: true*/ },
        component: () => import("@/views/my/tag/index.vue"),
      },
      {
        path: "shareRecord",
        name: "MyShareRecord",
        meta: { title: "ShareRecord", icon: "Share" /*keepAlive: true*/ },
        component: () => import("@/views/my/share_record/index.vue"),
      },
      {
        path: "loginLog",
        name: "MyLoginLog",
        meta: { title: "LoginLog", icon: "List" /*keepAlive: true*/ },
        component: () => import("@/views/my/login_log/index.vue"),
      },
    ],
  },
  {
    path: "/sys",
    name: "System",
    redirect: "/sys/index",
    meta: { title: "System", icon: "Setting" },
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "peer",
        name: "Peer",
        meta: { title: "PeerManage", icon: "Monitor" /*keepAlive: true*/ },
        component: () => import("@/views/peer/index.vue"),
      },
      {
        path: "group",
        name: "UserGroup",
        meta: { title: "GroupManage", icon: "ChatRound" /*keepAlive: true*/ },
        component: () => import("@/views/group/index.vue"),
      },
      {
        path: "deviceGroup",
        name: "DeviceGroup",
        meta: {
          title: "DeviceGroupManage",
          icon: "ChatRound" /*keepAlive: true*/,
        },
        component: () => import("@/views/group/deviceGroupList.vue"),
      },
      {
        path: "user",
        name: "User",
        meta: { title: "UserManage", icon: "User" /*keepAlive: true*/ },
        component: () => import("@/views/user/index.vue"),
      },
      {
        path: "user/add",
        name: "UserAdd",
        meta: { title: "UserAdd", hide: true },
        component: () => import("@/views/user/edit.vue"),
      },
      {
        path: "user/edit/:id",
        name: "UserEdit",
        meta: { title: "UserEdit", hide: true },
        component: () => import("@/views/user/edit.vue"),
      },
      {
        path: "addressBookManage",
        name: "UserAddressBookManage",
        meta: {
          title: "AddressBookManage",
          icon: "Collection" /*keepAlive: true*/,
        },
        component: () => import("@/views/address_book/collection.vue"),
      },
      {
        path: "addressBook",
        name: "UserAddressBook",
        meta: { title: "AddressBook", icon: "Notebook" /*keepAlive: true*/ },
        component: () => import("@/views/address_book/index.vue"),
      },
      {
        path: "tag",
        name: "UserTag",
        meta: {
          title: "TagsManage",
          icon: "CollectionTag" /*keepAlive: true*/,
        },
        component: () => import("@/views/tag/index.vue"),
      },
      {
        path: "oauth",
        name: "Oauth",
        meta: { title: "OauthManage", icon: "Link" /*keepAlive: true*/ },
        component: () => import("@/views/oauth/index.vue"),
      },
      {
        path: "userToken",
        name: "UserToken",
        meta: { title: "UserToken", icon: "Ticket" /*keepAlive: true*/ },
        component: () => import("@/views/user/token.vue"),
      },
      {
        path: "loginLog",
        name: "LoginLog",
        meta: { title: "LoginLog", icon: "List" /*keepAlive: true*/ },
        component: () => import("@/views/login/log.vue"),
      },
      {
        path: "auditConn",
        name: "AuditConn",
        meta: { title: "AuditConnLog", icon: "Tickets" /*keepAlive: true*/ },
        component: () => import("@/views/audit/connList.vue"),
      },
      {
        path: "auditFile",
        name: "AuditFile",
        meta: { title: "AuditFileLog", icon: "Files" /*keepAlive: true*/ },
        component: () => import("@/views/audit/fileList.vue"),
      },
      {
        path: "shareRecord",
        name: "ShareRecord",
        meta: { title: "ShareRecord", icon: "Share" /*keepAlive: true*/ },
        component: () => import("@/views/share_record/index.vue"),
      },
      {
        path: "serverCmd",
        name: "ServerCmd",
        meta: { title: "ServerCmd", icon: "Tools" /*keepAlive: true*/ },
        component: () => import("@/views/rustdesk/control.vue"),
      },
    ],
  },
];

export const lastRoutes = [
  { path: "/:catchAll(.*)", redirect: "/404", meta: { hide: true } },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});
