import { format } from "date-fns";
import type { Timestamp } from "firebase/firestore";

// Format timestamp into a readable date and time (HH:mm - dd/MM/yyyy)
export const formatTimestamp = (timestamp: Timestamp) => {
	return format(timestamp.toDate(), "HH:mm - dd/MM/yyyy");
};
