export class Preference {
  constructor(
    public readonly id: number,
    public readonly userId: number | null, // Puede ser null para respuestas anónimas
    public readonly tagId: number,
    public readonly tagName: string, // Guardamos el nombre del tag para evitar joins
    public readonly createdAt: Date
  ) {}

  static create(
    userId: number | null,
    tagId: number,
    tagName: string
  ): Preference {
    return new Preference(
      0, // El ID será asignado por la base de datos
      userId,
      tagId,
      tagName,
      new Date()
    );
  }
}
