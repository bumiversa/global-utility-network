export const imageMetadataKnowledge = {
  introduction:
    "An Image Metadata Inspector allows you to read hidden EXIF data embedded in your photos. All processing is performed locally in your browser, ensuring your files are never uploaded or exposed.",
  
  sections: [
    {
      title: "What is EXIF Data?",
      content:
        "EXIF (Exchangeable Image File Format) is a standard that specifies the formats for images, sound, and ancillary tags used by digital cameras, scanners, and other systems. It stores information like camera model, shutter speed, date and time, and sometimes GPS coordinates.",
    },
    {
      title: "Why Check Metadata?",
      content:
        "Metadata can reveal more than you intend to share. For example, a photo taken with a smartphone might contain precise GPS coordinates of your home or workplace. Inspecting this data before sharing images online is a crucial step in protecting your digital privacy.",
    },
    {
      title: "Supported Formats",
      content:
        "This tool currently supports JPEG and WEBP formats, which are the most common formats that retain EXIF metadata. PNG files typically strip this data or store it in different, less standardized chunks (which are not supported in this V1 release).",
    },
    {
      title: "Privacy & Processing",
      content:
        "🔒 **100% Client-Side Processing.** Your image file is read directly by your browser's File API. It is never uploaded to any server, stored in local storage, or included in analytics payloads. The inspection happens entirely in your device's memory.",
    },
  ],
};