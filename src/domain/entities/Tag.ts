export class Tag {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string | null,
    public readonly color: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    name: string,
    description: string | null = null,
    color: string | null = null
  ): Tag {
    const now = new Date();
    return new Tag(
      0, // El ID será generado automáticamente por la base de datos
      name,
      description,
      color,
      now,
      now
    );
  }
}
