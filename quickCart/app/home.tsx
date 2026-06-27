import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { authStore } from "../services/authStore";

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Interactive state
  const currentUser = authStore.getCurrentUser();
  const welcomeName = currentUser ? currentUser.name : "Guest";
  const userInitials = currentUser
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "G";

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            authStore.logout();
            router.replace("/login" as any);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const [cartCount, setCartCount] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { id: "All", name: "All", icon: "grid-outline" },
    { id: "Veg", name: "Veggies", icon: "leaf-outline", color: "#10b981", bg: "#ecfdf5" },
    { id: "Fruit", name: "Fruits", icon: "nutrition-outline", color: "#ef4444", bg: "#fef2f2" },
    { id: "Dairy", name: "Dairy", icon: "water-outline", color: "#3b82f6", bg: "#eff6ff" },
    { id: "Bakery", name: "Bakery", icon: "restaurant-outline", color: "#f59e0b", bg: "#fffbeb" },
  ];

  const products = [
    {
      id: 1,
      name: "Organic Tomatoes",
      category: "Veg",
      weight: "500g",
      price: 1.99,
      rating: 4.8,
      icon: "apple", // MaterialCommunityIcons
      iconColor: "#ef4444",
      bg: "#fee2e2",
    },
    {
      id: 2,
      name: "Fresh Whole Milk",
      category: "Dairy",
      weight: "1 Liter",
      price: 2.49,
      rating: 4.9,
      icon: "bottle-tonic-plus",
      iconColor: "#3b82f6",
      bg: "#dbeafe",
    },
    {
      id: 3,
      name: "Wheat Bread",
      category: "Bakery",
      weight: "400g",
      price: 1.89,
      rating: 4.6,
      icon: "bread-slice",
      iconColor: "#d97706",
      bg: "#fef3c7",
    },
    {
      id: 4,
      name: "Organic Bananas",
      category: "Fruit",
      weight: "1 Bunch",
      price: 1.29,
      rating: 4.9,
      icon: "food-apple",
      iconColor: "#eab308",
      bg: "#fef9c3",
    },
    {
      id: 5,
      name: "Fresh Broccoli",
      category: "Veg",
      weight: "350g",
      price: 1.49,
      rating: 4.7,
      icon: "pine-tree",
      iconColor: "#10b981",
      bg: "#d1fae5",
    },
    {
      id: 6,
      name: "Greek Yogurt",
      category: "Dairy",
      weight: "500g",
      price: 3.29,
      rating: 4.8,
      icon: "cup",
      iconColor: "#6366f1",
      bg: "#e0e7ff",
    },
  ];

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* 1. Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>Welcome, {welcomeName.split(" ")[0]} 👋</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#0284c7" />
            <Text style={styles.locationText}>Home - 102 Park Ave</Text>
            <Ionicons name="chevron-down" size={12} color="#64748b" style={styles.locationArrow} />
          </View>
        </View>
        <View style={styles.headerRight}>
          {/* Cart Icon with Badge */}
          <TouchableOpacity style={styles.cartButton} activeOpacity={0.8}>
            <Ionicons name="cart-outline" size={24} color="#0f172a" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* User Profile Avatar */}
          <TouchableOpacity
            style={styles.avatar}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Text style={styles.avatarText}>{userInitials}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Scrollable Dashboard */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 2. Search Bar Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Search groceries, fruits, milk..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
              editable={false} // Mock input
            />
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={18} color="#0284c7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Promo Banner */}
        <View style={styles.promoContainer}>
          <View style={styles.promoCard}>
            <View style={styles.promoTextContent}>
              <Text style={styles.promoTag}>50% OFF FIRST ORDER</Text>
              <Text style={styles.promoTitle}>Fresh Grocery & Fast delivery</Text>
              <TouchableOpacity style={styles.promoBtn} activeOpacity={0.9}>
                <Text style={styles.promoBtnText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.promoGraphicsContainer}>
              <View style={styles.promoCircleGlow} />
              <MaterialCommunityIcons name="basket" size={90} color="#e0f2fe" style={styles.basketIcon} />
            </View>
          </View>
        </View>

        {/* 4. Horizontal Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                  !isSelected && cat.bg ? { backgroundColor: cat.bg } : null,
                ]}
                activeOpacity={0.8}
              >
                {cat.id === "All" ? (
                  <Ionicons
                    name={cat.icon as any}
                    size={18}
                    color={isSelected ? "#ffffff" : "#0f172a"}
                  />
                ) : (
                  <Ionicons
                    name={cat.icon as any}
                    size={18}
                    color={isSelected ? "#ffffff" : cat.color}
                  />
                )}
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                    !isSelected && cat.color ? { color: cat.color } : null,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 5. Products Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Items</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Grid layout of products */}
        <View style={styles.productsGrid}>
          {filteredProducts.map((prod) => (
            <View key={prod.id} style={styles.productCard}>
              <View style={[styles.productImageContainer, { backgroundColor: prod.bg }]}>
                <MaterialCommunityIcons name={prod.icon as any} size={48} color={prod.iconColor} />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={10} color="#f59e0b" />
                  <Text style={styles.ratingText}>{prod.rating}</Text>
                </View>
              </View>

              <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={1}>
                  {prod.name}
                </Text>
                <Text style={styles.productWeight}>{prod.weight}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>${prod.price.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.8}
                    onPress={handleAddToCart}
                  >
                    <Ionicons name="add" size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 6. Mock Bottom Navigation Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.8}>
          <Ionicons name="home" size={24} color="#0284c7" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.8}>
          <Ionicons name="search-outline" size={24} color="#64748b" />
          <Text style={styles.tabLabel}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.8}>
          <Ionicons name="receipt-outline" size={24} color="#64748b" />
          <Text style={styles.tabLabel}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.8}>
          <Ionicons name="person-outline" size={24} color="#64748b" />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerLeft: {
    flexDirection: "column",
  },
  welcomeText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginLeft: 4,
  },
  locationArrow: {
    marginLeft: 3,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  cartBadgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0284c7",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 80, // Space for bottom tab bar
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#0f172a",
  },
  filterButton: {
    padding: 4,
  },
  promoContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  promoCard: {
    height: 140,
    borderRadius: 20,
    backgroundColor: "#0284c7",
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#0284c7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  promoTextContent: {
    flex: 1.2,
    padding: 18,
    justifyContent: "center",
  },
  promoTag: {
    color: "#ffffff",
    opacity: 0.8,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  promoTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 6,
    lineHeight: 22,
  },
  promoBtn: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  promoBtnText: {
    color: "#0284c7",
    fontSize: 11,
    fontWeight: "700",
  },
  promoGraphicsContainer: {
    flex: 0.8,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  promoCircleGlow: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#0ea5e9",
    opacity: 0.5,
    right: -20,
    bottom: -20,
  },
  basketIcon: {
    opacity: 0.85,
    transform: [{ rotate: "-15deg" }],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  seeAllText: {
    fontSize: 13,
    color: "#0284c7",
    fontWeight: "600",
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    gap: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  categoryPillSelected: {
    backgroundColor: "#0284c7",
    borderColor: "#0284c7",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
  },
  categoryTextSelected: {
    color: "#ffffff",
  },
  productsGrid: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  productCard: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  productImageContainer: {
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0f172a",
  },
  productDetails: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  productWeight: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
  },
  addButton: {
    backgroundColor: "#0284c7",
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0284c7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 3,
  },
  tabLabelActive: {
    color: "#0284c7",
  },
});
