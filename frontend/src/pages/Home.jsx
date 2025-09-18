import { API_PATHS, BASE_URL } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter as ModalFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function Home(){
  const [user,setUser]=useState(null)
  const [posts,setPost]=useState([])
  const [image,setImage]=useState(null)
  const [text,setText]=useState("")
  const [editingPost,setEditingPost]=useState(null)
  const [editText,setEditText]=useState("")
  const [composerOpen, setComposerOpen] = useState(false)

  useEffect(()=>{
    
    const fetchPosts = async()=>{
      const res = await axiosInstance.get(API_PATHS.POST.GET_POST)
      setPost(res.data)
    }
    fetchPosts()
    const getUser = async()=>{
      const res = await axiosInstance.get(API_PATHS.AUTH.PROFILE)
      setUser(res.data)
    }
    getUser()
  },[])

  const handleSubmit =async(e)=>{
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (image) {
        formData.append("image", image);
      }

      const res = await axiosInstance.post(API_PATHS.POST.ADD_POST, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const created = res?.data?.post || res?.data
      if (created) {
        setPost((prev)=> [created, ...(Array.isArray(prev)? prev : [])])
      }

      setText("");
      setImage(null);
      setComposerOpen(false)
    } catch (err) {
      console.error("Error creating post:", err);
    }
  }

  const deletePost =async(id)=>{
    try {
    await axiosInstance.delete(`${API_PATHS.POST.DELETE_POST}/${id}`);
    setPost(posts.filter((p) => p._id !== id));
  } catch (err) {
    console.error("Delete failed:", err);
  }}

  const startEditing=(post)=>{
    setEditingPost(post._id);
    setEditText(post.text)
  }

  const updatePost = async(id)=>{
    try{
      const res = await axiosInstance.put(API_PATHS.POST.UPDATE_POST/id,{
        editText
      })
      setPost(posts.map((p)=>(p._id === id? res.data : p )))
      setEditingPost(null)
    }catch(err){
      console.error("Failed to edit",err)
    }
  }

  const initials = (val) => {
    const name = typeof val === "string" ? val : val?.name || val?.username || ""
    if (!name || typeof name !== "string") return "SP"
    return name.trim().split(/\s+/).map(p => p[0]).join("").toUpperCase().slice(0, 2)
  }
  const imageSrc = (url) => {
    if (!url) return null
    const raw = String(url).trim()
    if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) return raw
    // Normalize Windows-style backslashes and strip common "public" prefixes
    let path = raw.replace(/\\\\/g, "/").replace(/\\/g, "/")
    path = path.replace(/^\.?\/?public\//i, "/")
    if (!path.startsWith("/")) path = "/" + path
    try {
      return new URL(path, BASE_URL).toString()
    } catch {
      return `${BASE_URL.replace(/\/$/, "")}${path}`
    }
  }

  const currentDisplayName = user?.name || user?.username || "User";
  const postOwnerName = (post) => post.author.name
  const postOwnerImage =(post) => post.author.imageUrl
  const getOwnerId = (post) => post?.user?._id || post?.author?._id || post?.userId || post?.authorId || null;
  const isMyPost = (post) => {
    const uid = user?._id || user?.id || user?.userId;
    const pid = getOwnerId(post);
    if (uid && pid) return String(uid) === String(pid);
    const pname = postOwnerName(post);
    return pname && currentDisplayName && String(pname).toLowerCase() === String(currentDisplayName).toLowerCase();
  }

  return(
  <div className="min-h-screen bg-background text-foreground">
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post)=>(
          <Card key={post._id}>
            <CardHeader className="flex-row items-start gap-3 justify-between">
              <div className="flex items-start gap-3">
                <Avatar>
                  {postOwnerImage(post) && (
                    <AvatarImage src={imageSrc(postOwnerImage(post))} alt={postOwnerName(post)} />
                  )}
                  <AvatarFallback>{initials(postOwnerName(post))}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{postOwnerName(post)}</span>
                    {post.createdAt && (
                      <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
              {isMyPost(post) && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={()=>startEditing(post)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={()=>deletePost(post._id)}>Delete</Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {editingPost === post._id ? (
                <div className="space-y-3">
                  <Textarea value={editText} onChange={(e)=>setEditText(e.target.value)} rows={3}/>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={()=>updatePost(post._id)}>Save</Button>
                    <Button size="sm" variant="outline" onClick={()=>setEditingPost(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{post.text}</p>
              )}
              {imageSrc(post.imageUrl) && (
                <img src={imageSrc(post.imageUrl)} alt="post" className="rounded-xl border object-cover max-h-[480px] w-full" loading="lazy" />
              )}
            </CardContent>
            <CardFooter>
              {/* actions like like/comment can go here */}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>

    {/* Floating composer */}
    <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-8 h-14 w-14 bg-gray-300 rounded-full p-0 shadow-lg" aria-label="Create post">
          <Plus className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className=' text-black bg-gray-200'>
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
          <DialogDescription>Share what’s happening.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="mt-1">
              <AvatarFallback>{initials(currentDisplayName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                value={text}
                onChange={(e)=>setText(e.target.value)}
                placeholder="What's happening?"
                rows={4}
              />
              <label className="my-2">Add Image</label>
              <Input type="file" accept="image/*" onChange={(e)=>setImage(e.target.files?.[0]||null)} className="max-w-xs"/>
            </div>
          </div>
          <ModalFooter>
            <Button type="submit" className='cursor-pointer' disabled={!text.trim()}>Post</Button>
          </ModalFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>)

}
