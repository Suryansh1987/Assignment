'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PackageSearch, LogIn, UserPlus } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
      <PackageSearch className="h-20 w-20 text-primary mb-8" />
      <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">
        Product Management
      </h1>
      <p className="mt-4 text-muted-foreground sm:text-xl">
        Streamline your product operations with our powerful management system
      </p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/dashboard">View Dashboard</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/products">View Products</Link>
        </Button>
      </div>
      
      {/* Authentication buttons */}
      <div className="mt-6 flex gap-4">
        <Button variant="ghost" size="sm" asChild className="flex items-center gap-2">
          <Link href="/signin">
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="flex items-center gap-2">
          <Link href="/signup">
            <UserPlus className="h-4 w-4" />
            <span>Sign Up</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}