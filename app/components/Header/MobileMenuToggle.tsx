import {useAside} from '~/components/Aside';

export function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="sf-header__mobile-toggle reset"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <span className="sf-header__hamburger" />
    </button>
  );
}
