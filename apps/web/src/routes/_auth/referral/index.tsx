import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/referral/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/referral/"!</div>
}
