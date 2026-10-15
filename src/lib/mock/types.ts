/**
 * A tartomány típusai – angol azonosítókkal (AGENTS.md 3. pont).
 * Ezek lesznek az adatbázis-táblák típusai is, ezért már most a séma szerint vannak elnevezve.
 */

export type GarmentStatus = "available" | "loaned" | "overdue" | "repair" | "lost";
export type GarmentCondition = "new" | "good" | "worn" | "damaged";

export interface GarmentType {
  /** Rövid kód, ez lesz az azonosító előtagja (pl. ING-0042). */
  code: string;
  name: string;
}

export interface Region {
  slug: string;
  name: string;
}

export interface Garment {
  /** Olvasható, egyedi azonosító a típus előtagjával. */
  inventoryCode: string;
  typeCode: string;
  regionSlug: string;
  size: string;
  color: string;
  condition: GarmentCondition;
  status: GarmentStatus;
  /** Kiadás alatt: kinek és meddig. */
  loanedTo: string | null;
  dueAt: string | null;
  createdAt: string;
  /** Becsült érték forintban. */
  value: number;
  notes: string | null;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  memberSince: string;
}

export interface Loan {
  id: string;
  inventoryCode: string;
  memberId: string;
  memberName: string;
  loanedAt: string;
  returnedAt: string | null;
  dueAt: string;
}
