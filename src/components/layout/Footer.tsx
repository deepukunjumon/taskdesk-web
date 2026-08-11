import packageJson from '../../../package.json'
export function Footer() {
  return (
    <footer className="shrink-0 py-4 text-center text-sm text-muted-foreground">
      TaskDesk v{packageJson.version} &copy; {new Date().getFullYear()}
    </footer>
  )
}
