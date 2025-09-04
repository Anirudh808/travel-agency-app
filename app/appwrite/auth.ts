import { ID, OAuthProvider, Query } from "appwrite";
import { account, database, appwriteConfig } from "~/appwrite/client";
import { redirect } from "react-router";

export const getExistingUser = async (id: string) => {
  try {
    const { rows, total } = await database.listRows(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", id)]
    );
    return total > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();
    if (!user) throw new Error("User not found");

    // Get current session
    const sessions = await account.listSessions();
    const currentSession = sessions.sessions.find((s) => s.current);
    const providerAccessToken = currentSession?.providerAccessToken;

    console.log("from storeUser current session: ", currentSession);
    console.log("from storeUser providedAccessToken: ", providerAccessToken);

    // If Google OAuth, fetch profile picture
    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;

    console.log("from storeUser profile picture: ", profilePicture);

    // Create user doc
    const createdUser = await database.createRow(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: profilePicture,
        joinedAt: new Date().toISOString(),
      }
    );

    console.log("from storeuser created user: ", createdUser);

    if (!createdUser.$id) redirect("/sign-in");
    return createdUser;
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

const getGooglePicture = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!response.ok) throw new Error("Failed to fetch Google profile picture");

    const { photos } = await response.json();
    return photos?.[0]?.url || null;
  } catch (error) {
    console.error("Error fetching Google picture:", error);
    return null;
  }
};

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`
    );
  } catch (error) {
    console.error("Error during OAuth2 session creation:", error);
  }
};

export const signUpUser = async () => {
  const user = await account.get();
  console.log("From loginWithGoogle => user: ", user);
  if (!user.$id) {
    return redirect("/sign-in");
  }
  const existingUser = await getExistingUser(user.$id);

  if (!existingUser?.$id) {
    return await storeUserData();
  } else {
    return existingUser;
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    return redirect("/sign-in");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();
    if (!user) return redirect("/sign-in");

    const { rows } = await database.listRows(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ]
    );

    return rows.length > 0 ? rows[0] : redirect("/sign-in");
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
