export const googleHandler = (redirectUri: string) => {
    const clientId = "375545762738-9mo859gr6vpaa42v49kgivgbp3ioiov8.apps.googleusercontent.com";
    const scope = "email profile";
  
    // Redirect to Google's OAuth 2.0 authorization endpoint
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = googleAuthUrl;
  };