import ChartsContainer from "@/components/admin/ChartsContainer"
import { ChartsLoading, StatsLoadingContainer } from "@/components/admin/Loading"
import StatsContainer from "@/components/admin/StatsContainer"
import { Suspense } from "react"

function AdminPage() {
  return (
    <>
    <Suspense fallback={<StatsLoadingContainer/>}>
      <StatsContainer />
    </Suspense>
    <Suspense fallback={<ChartsLoading/>}>
      <ChartsContainer />
    </Suspense>
    </>
  )
}

export default AdminPage