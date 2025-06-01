import { createLazyFileRoute } from '@tanstack/react-router'
import {useHeaderHeightAdjustment} from "../useHeaderHeightAdjustment.js";

export const Route = createLazyFileRoute('/book')({
  component: RouteComponent,
})

function RouteComponent() {
  const height = useHeaderHeightAdjustment()
  return <div style={{'margin-top':height}}>Hello "/book"!</div>
}
