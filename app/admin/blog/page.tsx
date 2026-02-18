import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, FileText } from "lucide-react"
import { getAdminBlogPosts, deleteBlogPost } from "@/app/actions/admin-blog"

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
    draft: "bg-neutral-100 text-neutral-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-yellow-100 text-yellow-800",
}

interface AdminBlogPageProps {
    searchParams: Promise<{ status?: string }>
}

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
    const params = await searchParams
    const status = params.status || "all"

    const { posts, error } = await getAdminBlogPosts(status)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
                <Button asChild>
                    <Link href="/admin/blog/new">
                        <Plus className="mr-2 h-4 w-4" /> New Post
                    </Link>
                </Button>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-1.5">
                {[
                    { value: "all", label: "All" },
                    { value: "draft", label: "Drafts" },
                    { value: "published", label: "Published" },
                    { value: "archived", label: "Archived" },
                ].map((s) => (
                    <a
                        key={s.value}
                        href={`/admin/blog?status=${s.value}`}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${status === s.value
                                ? "bg-neutral-900 text-white"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            }`}
                    >
                        {s.label}
                    </a>
                ))}
            </div>

            {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
            )}

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post: any) => (
                            <TableRow key={post.id}>
                                <TableCell className="font-medium max-w-[250px] truncate">{post.title}</TableCell>
                                <TableCell className="text-sm text-muted-foreground font-mono max-w-[150px] truncate">{post.slug}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[post.status] || ""}`}>
                                        {post.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {post.published_at
                                        ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                        : "—"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/blog/${post.id}/edit`}><Edit className="h-4 w-4" /></Link>
                                        </Button>
                                        <form action={async () => { "use server"; await deleteBlogPost(post.id) }}>
                                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {posts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <FileText className="mx-auto h-10 w-10 text-neutral-300 mb-2" />
                                    <p className="text-sm text-muted-foreground">No blog posts yet</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
