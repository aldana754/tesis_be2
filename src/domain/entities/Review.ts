export class Review {
  constructor(
    public readonly id: number,
    public readonly offerId: number, // Relación ManyToOne - una review pertenece a una oferta
    public readonly userId: number, // Relación ManyToOne - una review pertenece a un usuario
    public readonly comment: string,
    public readonly rating: number, // De 1 a 5
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    // Validaciones en el constructor
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (comment.length > 600) {
      throw new Error('Comment must not exceed 600 characters');
    }
  }

  static create(
    offerId: number,
    userId: number,
    comment: string,
    rating: number
  ): Review {
    // Validaciones antes de crear
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (!comment || comment.trim().length === 0) {
      throw new Error('Comment is required');
    }
    if (comment.length > 600) {
      throw new Error('Comment must not exceed 600 characters');
    }
    if (!Number.isInteger(rating)) {
      throw new Error('Rating must be an integer');
    }

    const now = new Date();
    return new Review(
      0, // ID será generado por la base de datos
      offerId,
      userId,
      comment.trim(),
      rating,
      now,
      now
    );
  }
}
