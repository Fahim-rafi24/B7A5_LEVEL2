import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 mt-auto">
            <div className="container-custom py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                    <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
                        Rent<span className="text-blue-400">Nest</span>
                    </Link>
                    <p className="text-sm text-slate-400 mt-3 max-w-sm leading-relaxed">
                        Find & list rental properties with ease. RentNest connects tenants, landlords, and
                        admins on one modern marketplace platform.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Explore</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/" className="hover:text-white transition">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/properties" className="hover:text-white transition">
                                Browse Properties
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/register" className="hover:text-white transition">
                                Register
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/login" className="hover:text-white transition">
                                Sign In
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Dashboards</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/dashboard/tenant" className="hover:text-white transition">
                                Tenant
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/landlord" className="hover:text-white transition">
                                Landlord
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/admin" className="hover:text-white transition">
                                Admin
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-slate-800">
                <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                    <span>© {new Date().getFullYear()} RentNest. All rights reserved.</span>
                    <span>Built with Next.js, Tailwind CSS & React Query.</span>
                </div>
            </div>
        </footer>
    );
}
