package main

type User struct {
	ID          string
	DisplayName string
}

type Room struct {
	ID    int
	Name  string
	Users map[string]User
}

func NewRoom() *Room {
	return &Room{
		ID:    1,
		Name:  "test",
		Users: map[string]User{},
	}
}

func (r *Room) AddUser(userID string) {
	if _, ok := r.Users[userID]; ok {
		return
	}

	r.Users[userID] = User{
		ID:          userID,
		DisplayName: userID,
	}
}

func (r *Room) RemoveUser(userID string) {
	if _, ok := r.Users[userID]; ok {
		delete(r.Users, userID)
	}
}
