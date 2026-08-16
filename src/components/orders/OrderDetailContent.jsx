"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AlertTriangle, MapPin, Tag, Wallet, Star } from "lucide-react";
import { getOrderById } from "@/lib/api/orders";
import { createReview, getProductReviews } from "@/lib/api/reviews";
import { formatCurrency, formatDate } from "@/utils/format";
import Breadcrumb from "@/components/common/Breadcrumb";
import ErrorState from "@/components/home/ErrorState";
import ImageWithFallback from "@/components/home/ImageWithFallback";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderTimeline from "./OrderTimeline";
import OrderDetailSkeleton from "./OrderDetailSkeleton";
import OrderReviewModal from "@/components/product-detail/OrderReviewModal";

export default function OrderDetailContent({ orderId }) {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");

  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");

      try {
        const data = await getOrderById(orderId);

        if (!cancelled) {
          if (data?.order) {
            const loadedOrder = data.order;

            setOrder(loadedOrder);

            // Check which products the current user has already reviewed
            const delivered = loadedOrder.orderStatus === "Delivered";

            if (delivered && Array.isArray(loadedOrder.items)) {
              const reviewedIds = [];

              await Promise.all(
                loadedOrder.items.map(async (item) => {
                  const productId = item.product?._id || item.product;

                  if (!productId) return;

                  try {
                    const reviewData = await getProductReviews(productId);

                    const hasMyReview = (reviewData?.reviews || []).some(
                      (review) =>
                        String(review.user?._id || review.user) ===
                        String(loadedOrder.user?._id || loadedOrder.user)
                    );

                    if (hasMyReview) {
                      reviewedIds.push(String(productId));
                    }
                  } catch {
                    // Ignore review loading errors.
                  }
                })
              );

              setReviewedProducts(reviewedIds);
            }

            setStatus("succeeded");
          }
          else {
            setStatus("failed");
          }
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error?.message || "We couldn't load this order");
          setStatus("failed");
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  async function handleReviewSubmit({ rating, comment }) {
    if (!reviewProduct) return;

    const productId =
      reviewProduct.product?._id ||
      reviewProduct.product;

    if (!productId) {
      toast.error("Product information is missing");
      return;
    }

    setReviewSubmitting(true);

    try {
      const data = await createReview({
        productId,
        rating,
        comment,
      });

      if (data?.success) {
        setReviewedProducts((previous) => [...previous, String(productId)]);
        setReviewProduct(null);

        toast.success(data.message || "Review added successfully");
      }
    } catch (error) {
      toast.error(
        error?.message || "Unable to submit your review"
      );
    } finally {
      setReviewSubmitting(false);
    }
  }

  const breadcrumbItems = [
    { label: "My Orders", href: "/orders" },
    { label: order?.orderNumber || "Order" },
  ];

  if (status === "loading") {
    return (
      <section className="container-fb py-10 lg:py-14">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-8">
          <OrderDetailSkeleton />
        </div>
      </section>
    );
  }

  if (status === "failed" || !order) {
    return (
      <section className="container-fb py-10 lg:py-14">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-8">
          <ErrorState
            icon={AlertTriangle}
            title="Order not found"
            description="We couldn't load this order. It may not exist, or you may not have access to it."
          />
        </div>
      </section>
    );
  }

  const itemCount = (order.items || []).reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const isDelivered = order.orderStatus === "Delivered";

  return (
    <>
      <section className="container-fb py-10 lg:py-14">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">
              {order.orderNumber}
            </h1>

            <p className="mt-1 text-sm text-ink-500">
              Placed on {formatDate(order.createdAt)} · {itemCount}{" "}
              item{itemCount === 1 ? "" : "s"}
            </p>
          </div>

          <OrderStatusBadge status={order.orderStatus} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card-fb mt-8 p-6"
        >
          <OrderTimeline status={order.orderStatus} />
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="card-fb p-6"
          >
            <h2 className="text-base font-semibold text-ink-900">
              Items
            </h2>

            <div className="mt-4 space-y-4">
              {(order.items || []).map((item, index) => {
                const productId =
                  item.product?._id ||
                  item.product;

                const hasReviewed = reviewedProducts.includes(
                  String(productId)
                );

                return (
                  <div
                    key={
                      item.product?._id ||
                      item.product ||
                      index
                    }
                    className="flex items-center gap-4"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-cream-100">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-xs text-ink-400">
                        {formatCurrency(item.price)} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <p className="text-sm font-bold text-ink-900">
                        {formatCurrency(
                          item.price * item.quantity
                        )}
                      </p>

                      {isDelivered && productId && (
                        hasReviewed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
                            <Star
                              className="h-3.5 w-3.5 fill-current"
                              strokeWidth={1.8}
                            />
                            Reviewed
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setReviewProduct(item)
                            }
                            className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white shadow-brand transition hover:bg-brand-600"
                          >
                            Write a Review
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1,
            }}
            className="space-y-4"
          >
            <div className="card-fb p-6">
              <h2 className="text-base font-semibold text-ink-900">
                Order summary
              </h2>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-ink-500">
                  <span>Subtotal</span>

                  <span className="font-semibold text-ink-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex items-center justify-between text-success">
                    <span className="flex items-center gap-1.5">
                      <Tag
                        className="h-3.5 w-3.5"
                        strokeWidth={1.8}
                      />

                      Discount{" "}
                      {order.coupon
                        ? `(${order.coupon})`
                        : ""}
                    </span>

                    <span className="font-semibold">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-ink-500">
                  <span>Shipping</span>

                  <span className="font-semibold text-success">
                    Free
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-cream-200 pt-3 text-base font-bold text-ink-900">
                  <span>Total</span>

                  <span>
                    {formatCurrency(order.finalAmount)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-cream-200 pt-4 text-sm text-ink-500">
                <Wallet
                  className="h-4 w-4 shrink-0 text-ink-400"
                  strokeWidth={1.8}
                />

                Payment:

                <span className="font-semibold text-ink-900">
                  {order.paymentMethod ||
                    "Cash on Delivery"}
                </span>
              </div>
            </div>

            {order.address && (
              <div className="card-fb p-6">
                <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900">
                  <MapPin
                    className="h-4 w-4 text-brand-600"
                    strokeWidth={1.8}
                  />

                  Shipping address
                </h2>

                <div className="mt-3 text-sm text-ink-500">
                  <p className="font-semibold text-ink-900">
                    {order.address.fullName}
                  </p>

                  <p className="mt-1">
                    {order.address.street},{" "}
                    {order.address.city},{" "}
                    {order.address.state}{" "}
                    {order.address.postalCode},{" "}
                    {order.address.country}
                  </p>

                  <p className="mt-1">
                    {order.address.phone}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <OrderReviewModal
        open={Boolean(reviewProduct)}
        onClose={() => {
          if (!reviewSubmitting) {
            setReviewProduct(null);
          }
        }}
        productName={reviewProduct?.name || "Product"}
        submitting={reviewSubmitting}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
}