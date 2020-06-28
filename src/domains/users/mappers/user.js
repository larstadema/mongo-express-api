export class UserMap {
  // TODO: Check if needed
  static toPersistence(user) {
    return user;
  }

  static toDomain(raw) {
    return raw.toObject();
  }

  static toDTO(raw) {
    // salt and password should never "leak" out
    // document version and createdAt/updatedAt are internals
    const { salt, password, __v, createdAt, updatedAt, ...dto } = raw.toObject();

    return dto;
  }
}
