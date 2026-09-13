import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { RequireAdmin } from '@/components/auth/RequireAdmin';
import { LoadingState } from '@/components/ui/LoadingState';

const Home = lazy(() => import('@/pages/public/Home'));
const HowItWorks = lazy(() => import('@/pages/public/HowItWorks'));
const Packages = lazy(() => import('@/pages/public/Packages'));
const ReferralInfo = lazy(() => import('@/pages/public/ReferralInfo'));
const Faq = lazy(() => import('@/pages/public/Faq'));
const About = lazy(() => import('@/pages/public/About'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const Terms = lazy(() => import('@/pages/public/Terms'));
const Privacy = lazy(() => import('@/pages/public/Privacy'));
const RiskDisclosure = lazy(() => import('@/pages/public/RiskDisclosure'));
const NotFound = lazy(() => import('@/pages/public/NotFound'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const WelcomeDeposit = lazy(() => import('@/pages/auth/WelcomeDeposit'));
const AdminLogin = lazy(() => import('@/pages/auth/AdminLogin'));
const Dashboard = lazy(() => import('@/pages/app/Dashboard'));
const MyPackage = lazy(() => import('@/pages/app/MyPackage'));
const Earnings = lazy(() => import('@/pages/app/Earnings'));
const WalletPage = lazy(() => import('@/pages/app/Wallet'));
const Deposit = lazy(() => import('@/pages/app/Deposit'));
const Withdraw = lazy(() => import('@/pages/app/Withdraw'));
const Transactions = lazy(() => import('@/pages/app/Transactions'));
const Referral = lazy(() => import('@/pages/app/Referral'));
const BonusHours = lazy(() => import('@/pages/app/BonusHours'));
const BotPass = lazy(() => import('@/pages/app/BotPass'));
const Notifications = lazy(() => import('@/pages/app/Notifications'));
const Support = lazy(() => import('@/pages/app/Support'));
const Profile = lazy(() => import('@/pages/app/Profile'));
const Settings = lazy(() => import('@/pages/app/Settings'));

const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminUsersList = lazy(() => import('@/pages/admin/Users'));
const AdminUserDetail = lazy(() => import('@/pages/admin/UserDetail'));
const AdminPackages = lazy(() => import('@/pages/admin/Packages'));
const AdminDeposits = lazy(() => import('@/pages/admin/Deposits'));
const AdminWithdrawals = lazy(() => import('@/pages/admin/Withdrawals'));
const AdminTransactions = lazy(() => import('@/pages/admin/Transactions'));
const AdminEarnings = lazy(() => import('@/pages/admin/Earnings'));
const AdminReferralManagement = lazy(() => import('@/pages/admin/ReferralManagement'));
const AdminBonusHours = lazy(() => import('@/pages/admin/BonusHours'));
const AdminBotPasses = lazy(() => import('@/pages/admin/BotPasses'));
const AdminPaymentMethods = lazy(() => import('@/pages/admin/PaymentMethods'));
const AdminExchangeRate = lazy(() => import('@/pages/admin/ExchangeRate'));
const AdminReports = lazy(() => import('@/pages/admin/Reports'));
const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotifications'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));

export function Root() {
    return (
        <Suspense fallback={<LoadingState label="Loading SilverQuantX…" />}>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route index element={<Home />} />
                    <Route path="how-it-works" element={<HowItWorks />} />
                    <Route path="packages" element={<Packages />} />
                    <Route path="referral" element={<ReferralInfo />} />
                    <Route path="faq" element={<Faq />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="risk-disclosure" element={<RiskDisclosure />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="register/deposit" element={<WelcomeDeposit />} />
                </Route>

                <Route element={<RequireAuth />}>
                    <Route path="/app" element={<AppLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="my-package" element={<MyPackage />} />
                        <Route path="earnings" element={<Earnings />} />
                        <Route path="wallet" element={<WalletPage />} />
                        <Route path="deposit" element={<Deposit />} />
                        <Route path="withdraw" element={<Withdraw />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="referral" element={<Referral />} />
                        <Route path="bonus-hours" element={<BonusHours />} />
                        <Route path="bot-pass" element={<BotPass />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="support" element={<Support />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Route>

                <Route path="admin/login" element={<AdminLogin />} />

                <Route element={<RequireAdmin />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsersList />} />
                        <Route path="users/:userId" element={<AdminUserDetail />} />
                        <Route path="packages" element={<AdminPackages />} />
                        <Route path="deposits" element={<AdminDeposits />} />
                        <Route path="withdrawals" element={<AdminWithdrawals />} />
                        <Route path="transactions" element={<AdminTransactions />} />
                        <Route path="earnings" element={<AdminEarnings />} />
                        <Route path="referrals" element={<AdminReferralManagement />} />
                        <Route path="bonus-hours" element={<AdminBonusHours />} />
                        <Route path="bot-passes" element={<AdminBotPasses />} />
                        <Route path="payment-methods" element={<AdminPaymentMethods />} />
                        <Route path="exchange-rate" element={<AdminExchangeRate />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="notifications" element={<AdminNotifications />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="admins" element={<AdminUsers />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
}
