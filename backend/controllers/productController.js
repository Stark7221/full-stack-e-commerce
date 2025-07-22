import productModel from "../models/productModel.js";
import {v2 as cloudinary} from "cloudinary";


//function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "Name, description, price, and category are required fields"
            });
        }

        // Process images safely
        const images = [];
        for (let i = 1; i <= 4; i++) {
            const imageKey = `image${i}`;
            if (req.files[imageKey] && req.files[imageKey][0]) {
                images.push(req.files[imageKey][0]);
            }
        }

        if (images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid images provided"
            });
        }

        // Upload images to Cloudinary
        let imagesUrl = [];
        try {
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, {
                        resource_type: "image"
                    });
                    return result.secure_url;
                })
            );
        } catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);
            return res.status(500).json({
                success: false,
                message: "Failed to upload product images"
            });
        }

        const producData = {
            name,
            description,
            category,
            subCategory,
            price:Number(price),
            bestSeller: bestSeller === "true" ? true :false,
            sizes:JSON.parse(sizes),
            image:imagesUrl,
            date:Date.now()
        }

        const product = new productModel(producData);
        await product.save();

        res.json({success:true ,message:"product added"})

    } catch (error) {
        console.error("Add Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

//function for list product
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({}).lean();
        
        if (!products || products.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No products found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            count: products.length,
            products 
        });

    } catch (error) {
        console.error("List Products Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while fetching products",
            error: error.message 
        });
    }
}

//function for removing product
const removeProduct = async (req, res) => {
    try {
        // 1. Gelen veriyi kontrol et
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }



        // 3. Ürünü bul ve sil
        const deletedProduct = await productModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // 5. Başarılı yanıt
        res.status(200).json({
            success: true,
            message: "Product successfully removed",
            deletedProductId: id
        });

    } catch (error) {
        console.error("Remove Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while removing product",
            error: error.message
        });
    }
}

//function for single product info
const singleProduct = async (req, res) => {
    try {
        // 1. Gelen veriyi kontrol et
        const { productId } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // 2. MongoDB ObjectId formatını kontrol et
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format"
            });
        }

        // 3. Ürünü bul
        const product = await productModel.findById(productId).lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // 4. Başarılı yanıt
        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Get Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching product",
            error: error.message
        });
    }
}
export {
    listProduct,
    singleProduct,
    addProduct,
    removeProduct
}