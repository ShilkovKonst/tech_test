export async function getAccountName(accountId: string) {
  try {
    const res = await fetch(`/api/unipile/accounts/${accountId}`);
    if (!res.ok) return;

    const { name } = await res.json();
    return name;
  } catch (e) {
    console.error("Sync account failed:", e);
  }
}

export async function connectNewAccount(provider: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL}/api/unipile/connect?provider=${provider}`,
      { method: "POST" }
    );
    if (!response.ok) {
      throw new Error(`Something went wrong fetching `);
    }
    return response.url;
  } catch (error) {
    console.error("Bad credentials:", error);
  }
}

export async function deleteAccountById(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL}/api/unipile/accounts/${id}`,
      { method: "DELETE" }
    );
    console.log(response);
    if (!response.ok) {
      throw new Error(`Something went wrong fetching `);
    }
    return response.ok;
  } catch (error) {
    console.error("Bad credentials:", error);
  }
}

export async function getAccountsList() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL}/api/unipile/accounts`
    );

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Успех!");
      console.log(data);
    } else {
      console.log("❌ Ошибка от сервера Unipile:");
      console.log(data);
    }
  } catch (error) {
    console.error("💥 Ошибка сети или выполнения:", error);
  }
}
