import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";

actor {
  // Product data type
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    scaleSize : Text;
    price : Nat;
    image : ?Storage.ExternalBlob;
    createdAt : Int;
  };

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<Text, Product>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their own profile ");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile ");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    // Should only be called by users (NOT guests)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product functions
  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    switch (products.get(product.id)) {
      case (?_) {
        Runtime.trap("Product with id '" # product.id # "' already exists");
      };
      case (null) {};
    };

    let productWithTimestamp = { product with createdAt = Time.now() };
    products.add(product.id, productWithTimestamp);
  };

  public shared ({ caller }) func updateProduct(id : Text, updatedProduct : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        let newProduct = {
          existingProduct with
          name = updatedProduct.name;
          description = updatedProduct.description;
          scaleSize = updatedProduct.scaleSize;
          price = updatedProduct.price;
          image = updatedProduct.image;
        };
        products.add(id, newProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.remove(id);
      };
    };
  };

  public shared ({ caller }) func seedDefaults() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed products");
    };

    let defaultProducts = [
      {
        id = "mustang-gt";
        name = "Ford Mustang GT 1:18 Model";
        description = "Classic American muscle car, red color, detailed with opening doors and hood.";
        scaleSize = "1:18";
        price = 2500;
        image = null;
        createdAt = 0;
      },
      {
        id = "lamborghini-aventador";
        name = "Lamborghini Aventador 1:24 Model";
        description = "Exotic Italian sports car, bright orange with detailed interiors.";
        scaleSize = "1:24";
        price = 3200;
        image = null;
        createdAt = 0;
      },
      {
        id = "vw-beetle";
        name = "Volkswagen Beetle 1:12 Model";
        description = "Iconic design, blue model with openable doors and trunk.";
        scaleSize = "1:12";
        price = 1500;
        image = null;
        createdAt = 0;
      },
      {
        id = "toyota-supra";
        name = "Toyota Supra 1:18 Model";
        description = "Japanese sports car, available in orange and white, high-detail paint job.";
        scaleSize = "1:18";
        price = 2700;
        image = null;
        createdAt = 0;
      },
      {
        id = "chevy-camaro";
        name = "Chevrolet Camaro 1:24 Model";
        description = "American muscle, detailed interior, yellow and black striped paint job.";
        scaleSize = "1:24";
        price = 1850;
        image = null;
        createdAt = 0;
      },
      {
        id = "porsche-911";
        name = "Porsche 911 1:18 Model";
        description = "Luxury German sports car, black model with hyper-realistic finish.";
        scaleSize = "1:18";
        price = 4000;
        image = null;
        createdAt = 0;
      },
    ];

    for (defaultProduct in defaultProducts.values()) {
      let productWithTimestamp = { defaultProduct with createdAt = Time.now() };
      products.add(productWithTimestamp.id, productWithTimestamp);
    };
  };
};
