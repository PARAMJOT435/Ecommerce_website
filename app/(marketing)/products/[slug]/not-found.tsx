import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { ArrowLeft, PackageSearch } from "lucide-react"

export default function ProductNotFound() {
    return (
        <Container>
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <div className="bg-muted rounded-full p-4">
                    <PackageSearch className="h-10 w-10 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Product Not Found</h1>
                <p className="text-muted-foreground max-w-md">
                    Adjust your filters or try searching for something else. This product may have been moved or is no longer available.
                </p>
                <Button asChild className="mt-4 gap-2">
                    <Link href="/products">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Products
                    </Link>
                </Button>
            </div>
        </Container>
    )
}
