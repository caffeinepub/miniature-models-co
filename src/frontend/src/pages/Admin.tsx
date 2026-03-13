import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  LogIn,
  Pencil,
  Plus,
  ShieldAlert,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, type Product } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateProduct,
  useDeleteProduct,
  useIsAdmin,
  useProducts,
  useUpdateProduct,
} from "../hooks/useQueries";

interface ProductFormData {
  name: string;
  description: string;
  scaleSize: string;
  price: string;
  imageFile: File | null;
  imagePreview: string | null;
}

const emptyForm = (): ProductFormData => ({
  name: "",
  description: "",
  scaleSize: "",
  price: "",
  imageFile: null,
  imagePreview: null,
});

const SKELETON_ROWS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

export function AdminPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: products, isLoading: productsLoading } = useProducts();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm());
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddDialog = () => {
    setEditProduct(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      scaleSize: product.scaleSize,
      price: Number(product.price).toString(),
      imageFile: null,
      imagePreview: product.image?.getDirectURL() ?? null,
    });
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, imageFile: file }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({
        ...prev,
        imagePreview: ev.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      toast.error("Name and price are required.");
      return;
    }

    let imageBlob: ExternalBlob | undefined;
    if (form.imageFile) {
      const buf = await form.imageFile.arrayBuffer();
      const bytes = new Uint8Array(buf);
      imageBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setUploadProgress(pct),
      );
    } else if (editProduct?.image) {
      imageBlob = editProduct.image;
    }

    const productData: Product = {
      id: editProduct?.id ?? crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim(),
      scaleSize: form.scaleSize.trim() || "1:43",
      price: BigInt(Math.round(Number(form.price))),
      createdAt: editProduct?.createdAt ?? BigInt(Date.now()),
      image: imageBlob,
    };

    try {
      if (editProduct) {
        await updateMutation.mutateAsync({
          id: editProduct.id,
          product: productData,
        });
        toast.success("Product updated!");
      } else {
        await createMutation.mutateAsync(productData);
        toast.success("Product created!");
      }
      setDialogOpen(false);
      setUploadProgress(0);
    } catch {
      toast.error("Failed to save product.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Product deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const triggerFileInput = () => fileInputRef.current?.click();

  // Not logged in
  if (!identity) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Please log in to access the admin panel.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
        </motion.div>
      </main>
    );
  }

  // Logged in but not admin
  if (!isAdminLoading && !isAdmin) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-destructive" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground text-sm">
            You do not have admin permissions.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          data-ocid="admin.add_button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Products table */}
      {productsLoading ? (
        <div className="space-y-3" data-ocid="admin.loading_state">
          {SKELETON_ROWS.map((id) => (
            <Skeleton key={id} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div
          className="text-center py-16 border border-dashed border-border rounded-lg"
          data-ocid="admin.empty_state"
        >
          <p className="text-muted-foreground mb-4">No products yet.</p>
          <Button onClick={openAddDialog} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add your first product
          </Button>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 w-16">
                  Image
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Name
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                  Scale
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                  Price
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product, i) => {
                const imgUrl = product.image?.getDirectURL();
                return (
                  <tr
                    key={product.id}
                    data-ocid={`admin.product.item.${i + 1}`}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="w-12 h-10 rounded overflow-hidden bg-secondary flex-shrink-0">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground text-sm">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="secondary" className="text-xs font-mono">
                        {product.scaleSize}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-display font-semibold text-sm">
                        ${Number(product.price).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                          data-ocid={`admin.product.edit_button.${i + 1}`}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(product)}
                          data-ocid={`admin.product.delete_button.${i + 1}`}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.product.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editProduct
                ? "Update product details."
                : "Fill in the details for the new model."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Ferrari 250 GTO"
                  data-ocid="admin.form.name_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="scale">Scale Size</Label>
                <Input
                  id="scale"
                  value={form.scaleSize}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, scaleSize: e.target.value }))
                  }
                  placeholder="1:18"
                  data-ocid="admin.form.scale_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="500"
                  data-ocid="admin.form.price_input"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Authentic 1:18 scale replica..."
                  rows={3}
                  data-ocid="admin.form.description_input"
                />
              </div>

              {/* Image Upload */}
              <div className="col-span-2 space-y-1.5">
                <Label>Product Image</Label>
                <button
                  type="button"
                  className="w-full border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={triggerFileInput}
                  onKeyDown={(e) => e.key === "Enter" && triggerFileInput()}
                  data-ocid="admin.form.upload_button"
                >
                  {form.imagePreview ? (
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="max-h-32 rounded object-contain"
                    />
                  ) : (
                    <div className="text-center flex flex-col items-center gap-1">
                      <UploadCloud className="w-8 h-8 text-muted-foreground/50" />
                      <div className="text-muted-foreground text-sm">
                        Click to upload image
                      </div>
                      <div className="text-xs text-muted-foreground/70">
                        JPG, PNG, WEBP
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {form.imagePreview && (
                    <span className="text-xs text-muted-foreground">
                      Click to change
                    </span>
                  )}
                </button>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="h-1 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.product.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              data-ocid="admin.product.save_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isSaving
                ? "Saving..."
                : editProduct
                  ? "Update Product"
                  : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="admin.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="admin.delete.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
