export default function Header() {
    const user = JSON.parse(localStorage.getItem("user")); // Get the current user stored in the localStorage and parse it as a JSON
    if(user && user.token) {
        //set up the token to be authenticated by the BE service
        return { "x-access-token": user.token };
    } else {
        return {};
    }
}