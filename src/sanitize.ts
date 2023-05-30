export function sanitizeFolderName(folderName:string) {
    // Transform to lowercase and replace spaces with hyphens
    folderName = folderName.toLowerCase().replace(/\s/g, '-');

    // Replace reserved characters on both Windows and Unix with '_'
    const sanitizedFolderName = folderName.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_');

    // Replace reserved names in Windows.
    const windowsReservedNames = [
        'con', 
        'prn', 
        'aux', 
        'nul', 
        'com1', 
        'com2', 
        'com3', 
        'com4', 
        'com5', 
        'com6', 
        'com7', 
        'com8', 
        'com9', 
        'lpt1', 
        'lpt2', 
        'lpt3', 
        'lpt4', 
        'lpt5', 
        'lpt6', 
        'lpt7', 
        'lpt8', 
        'lpt9'
    ];

    if(windowsReservedNames.includes(sanitizedFolderName)) {
        return '_' + sanitizedFolderName;
    }

    return sanitizedFolderName;
}
