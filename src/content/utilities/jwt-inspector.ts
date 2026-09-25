export const jwtInspectorKnowledge = {
  introduction:
    "JWT Inspector is a tool for examining the structure and readable contents of a JSON Web Token. It decodes the token locally so you can inspect its header, payload, and claims without attempting to authenticate or verify the token.",
  
  sections: [
    {
      title: "Understanding JWT Structure",
      content:
        "A JSON Web Token commonly consists of three parts: a header, a payload, and a signature, separated by periods. The header describes the token type and signing algorithm, while the payload contains claims. The signature is used by a verifier to check whether the token was signed correctly.",
    },
    {
      title: "Decoding Is Not Verification",
      content:
        "Decoding a JWT only reveals its encoded header and payload. It does not prove that the token was issued by a trusted party, that its contents have not been modified, or that its signature is valid. Verification requires the appropriate signing key and a dedicated validation process.",
    },
    {
      title: "Understanding Claims",
      content:
        "JWT payloads commonly contain claims such as issuer (iss), subject (sub), audience (aud), expiration time (exp), and issued-at time (iat). These values provide information about the token, but their meaning and enforcement depend entirely on the application that issued and verifies the token.",
    },
    {
      title: "Common Use Cases",
      content:
        "Developers use JWT Inspector to examine authentication tokens during development, troubleshoot authorization flows, inspect claims, and understand token structure when debugging applications.",
    },
    {
      title: "Handle Tokens Carefully",
      content:
        "A decoded JWT may contain information intended only for the token holder or application. Avoid sharing tokens containing sensitive claims, credentials, or other private information when debugging or inspecting authentication flows.",
    },
  ],
};
