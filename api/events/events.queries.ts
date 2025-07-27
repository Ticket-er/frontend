import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as eventsAPI from "@/api/events/events";
import { CreateEventDTO, EventFilterDTO, UpdateEventDTO } from "@/types/events.type";

export const useAllEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: eventsAPI.getAllEvents,
  });
};

export const useFilteredEvents = (filters: EventFilterDTO) => {
  return useQuery({
    queryKey: ["events", "filtered", filters],
    queryFn: () => eventsAPI.getFilteredEvents(filters),
  });
};

export const useEventById = (eventId: string) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventsAPI.getEventById(eventId),
    enabled: !!eventId,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => eventsAPI.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: UpdateEventDTO;
    }) => eventsAPI.updateEvent(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useToggleEventStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => eventsAPI.toggleEventStatus(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUserEvents = () => {
  return useQuery({
    queryKey: ["events", "user"],
    queryFn: eventsAPI.getUserEvents,
  });
};
export const useOrganizerEvents = () => {
  return useQuery({
    queryKey: ["events", "organizer"],
    queryFn: eventsAPI.getOrganizerEvents,
  });
};

export const useUpcomingEvents = () => {
  return useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: eventsAPI.getUpcomingEvents,
  });
};
