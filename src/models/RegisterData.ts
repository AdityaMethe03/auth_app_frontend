export default interface RegisterData {
  name: string;
  email: string;
  password: string;
  status: "ACTIVE" | "PENDING" | "REVIEW" | "DELETED" | "INACTIVE";
}
