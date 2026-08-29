import { UserProfile } from "@clerk/nextjs";

export default function AccountSettingsPage() {
  return (
    <main className="page-shell account-settings-page">
      <header className="page-intro compact"><p>ACCOUNT SECURITY</p><h1>账户与密码</h1><span>在“安全”页面修改密码，并管理当前账户的登录方式和设备会话。</span></header>
      <UserProfile routing="path" path="/account/settings" />
    </main>
  );
}
