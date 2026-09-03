import { Link, useNavigate } from "@tanstack/react-router";
import { HEADER_PILL } from "@/components/site/HeaderCtaPills";
import { useAuth } from "@/hooks/useAuth";
import { getPostAuthPath } from "@/lib/auth/redirects";
import { cn } from "@/lib/utils";

type HeaderAuthButtonsProps = {
  className?: string;
  onNavigate?: () => void;
};

export function HeaderAuthButtons({ className, onNavigate }: HeaderAuthButtonsProps) {
  const navigate = useNavigate();
  const { session, profile, loading, signOut } = useAuth();

  const goTo = (to: "/login" | "/signup" | string) => {
    onNavigate?.();
    navigate({ to });
  };

  if (!loading && session && profile) {
    const portalPath = getPostAuthPath(profile.role, profile.approval_status);
    return (
      <div className={cn("flex shrink-0 flex-nowrap items-center gap-2 2xl:gap-2.5", className)}>
        <button type="button" onClick={() => goTo(portalPath)} className={HEADER_PILL}>
          Portal
        </button>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            void signOut().then(() => navigate({ to: "/" }));
          }}
          className={HEADER_PILL}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex shrink-0 flex-nowrap items-center gap-2 2xl:gap-2.5", className)}>
      <button type="button" onClick={() => goTo("/login")} className={HEADER_PILL}>
        Login
      </button>
      <button type="button" onClick={() => goTo("/signup")} className={HEADER_PILL}>
        Sign up
      </button>
      <Link to="/login" className="sr-only">
        Login
      </Link>
      <Link to="/signup" className="sr-only">
        Sign up
      </Link>
    </div>
  );
}
