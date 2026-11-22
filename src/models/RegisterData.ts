export default interface RegisterData {
  tenantId: string;
  name: string;
  email: string;
  password: string;
  status: "ACTIVE" | "PENDING" | "REVIEW" | "DELETED" | "INACTIVE";
}
