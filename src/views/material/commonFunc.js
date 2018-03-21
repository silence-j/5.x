const commonFunc = {
  mapName (name, nameMap) {
    let title = name
    for (let i in nameMap) {
      if (name === i) {
        let countList = nameMap[name].count
        let count = 0
        for (let i = 0; i <= Math.max(...countList); i++) {
          if (countList.includes(count)) {
            count += 1
          }
        }
        title = count === 0 ? name : `${name}(${count})`
      }
    }
    return title
  },
  // 更新nameMap的状态，如果是以（数字）结尾的加入map
  updateNameMap (nameMap, folderList, isFolder) {
    let reg = new RegExp(/.+\(\d\)$/)
    for (let item of folderList) {
      let flag = isFolder ? item.dirName : item.name
      if (reg.test(flag)) {
        let name = flag.replace(/\(\d\)/, '')
        let countItem = Number(flag.replace(/.+\((\d)\)$/, '$1'))
        if (nameMap[name]) {
          nameMap[name].count.push(countItem)
          nameMap[name].count = [...new Set(nameMap[name].count)]
        } else {
          nameMap[name] = { count: [countItem] }
        }
      } else {
        nameMap[flag] = { count: [0] }
      }
    }
  },
  // 判断文件类型
  fileType (val, name) {
    let type
    //  后缀名
    let sufName = name[name.length - 3] + name[name.length - 2] + name[name.length - 1]
    if (val === 'application/octet-stream' && (sufName === 'jpg' || sufName === 'png' || sufName === 'gif' || sufName === 'peg')) {
      return 'img'
    } else {
      switch (val) {
        case 'application/x-zip-compressed':
          type = 'zip'
          break
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          type = 'xlsx'
          break
        case 'application/vnd.ms-excel':
          type = 'xlsx'
          break
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          type = 'pptx'
          break
        case 'application/vnd.ms-powerpoint':
          type = 'pptx'
          break
        case 'application/pdf':
          type = 'pdf'
          break
        case 'application/msword':
          type = 'docx'
          break
        case 'application/kswps':
          type = 'docx'
          break
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          type = 'docx'
          break
        case 'image/png':
          type = 'img'
          break
        case 'image/jpeg':
          type = 'img'
          break
        case 'image/gif':
          type = 'img'
          break
        case 'image/jpg':
          type = 'img'
          break
        default:
          type = 'other'
          break
      }
      return type
    }
  }
}

export default commonFunc
