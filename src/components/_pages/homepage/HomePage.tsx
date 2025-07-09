"use client";

import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";

import Button from "@/components/ui/button/Button";

export default function Homepage() {
  const router = useRouter();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold mb-6">Got 80% there with AI?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          You need a human for the last 20%. Connect with real developers who
          can finish what your no-code tools started. Post your technical
          roadblock, get it solved fast.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => {
              router.push(ROUTES.AUTH.SIGN_UP_VIBER);
            }}
          >
            Sign up (viber)
          </Button>
          <Button
            onClick={() => {
              router.push(ROUTES.AUTH.SIGN_UP_CODER);
            }}
          >
            Sign up (coder)
          </Button>
          <Button
            onClick={() => {
              router.push(ROUTES.AUTH.LOGIN);
            }}
          >
            Get started
          </Button>
          <a href="/pages/how-it-works">
            <Button variant="outline">How it works</Button>
          </a>
        </div>
      </div>
    </section>
  );
}
