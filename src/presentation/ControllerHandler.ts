import { UserProfileController } from './controllers/UserController';
import { OfferController } from './controllers/OfferController';
import { LocationController } from './controllers/LocationController';
import { AddressController } from './controllers/AddressController';
import { ReviewController } from './controllers/ReviewController';

export class ControllerHandler {
  private userProfileController: UserProfileController;
  private offerController: OfferController;
  private locationController: LocationController;
  private addressController: AddressController;
  private reviewController: ReviewController;

  constructor(
    userProfileController: UserProfileController,
    offerController: OfferController,
    locationController: LocationController,
    addressController: AddressController,
    reviewController: ReviewController
  ) {
    this.userProfileController = userProfileController;
    this.offerController = offerController;
    this.locationController = locationController;
    this.addressController = addressController;
    this.reviewController = reviewController;
  }

  getUserProfileHandler(): UserProfileController {
    return this.userProfileController;
  }

  getOfferHandler(): OfferController {
    return this.offerController;
  }

  getLocationHandler(): LocationController {
    return this.locationController;
  }

  getAddressHandler(): AddressController {
    return this.addressController;
  }

  getReviewHandler(): ReviewController {
    return this.reviewController;
  }
}
