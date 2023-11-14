package com.cointcompany.backend.domain.directories.service;

import com.cointcompany.backend.domain.directories.dto.DirectoriesDto;
import com.cointcompany.backend.domain.directories.entity.Directories;
import com.cointcompany.backend.domain.directories.entity.DirectoryUsers;
import com.cointcompany.backend.domain.directories.repository.DirectoriesRepository;
import com.cointcompany.backend.domain.directories.repository.DirectoryUsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class DirectoriesService {

    private final DirectoriesRepository directoriesRepository;
    private final DirectoryUsersRepository directoryUsersRepository;

    @Transactional(readOnly = true)
    public List<DirectoriesDto.GetDirectories> findAllDirectories() {

        List<DirectoriesDto.GetDirectories> getDirectoriesList = new ArrayList<>();
        List<Directories> directoriesList = directoriesRepository.findAll();

        for (Directories directories : directoriesList) {
            DirectoriesDto.GetDirectories getDirectories = new DirectoriesDto.GetDirectories(directories);
            getDirectoriesList.add(getDirectories);
        }

        return getDirectoriesList;
    }

    @Transactional
    public String saveDirectories(DirectoriesDto.PostDirectories postDirectories, Long parentDirectoriesId) {

        Directories directories = Directories.of(
                postDirectories.getDirName(),
                directoriesRepository.findById(parentDirectoriesId).orElseThrow()
        );

        directoriesRepository.save(directories);

        return "SUCCESS";
    }

    @Transactional
    public String modifyDirectories(DirectoriesDto.PostDirectories postDirectories, Long directoriesId) {

        Directories directories = directoriesRepository.findById(directoriesId).orElseThrow();
        directories.setDirName(postDirectories.getDirName());

        return "SUCCESS";

    }

    @Transactional
    public String removeDirectories(Long directoriesId) {

        directoriesRepository.deleteById(directoriesId);

        return "SUCCESS";
    }

    @Transactional(readOnly = true)
    public List<DirectoriesDto.GetDirectoryUsers> findDirectoryUsers() {

        List<DirectoriesDto.GetDirectoryUsers> getDirectoryUsersList = new ArrayList<>();
        List<DirectoryUsers> directoryUsersList = directoryUsersRepository.findAll();

        for (DirectoryUsers directoryUsers : directoryUsersList) {
            DirectoriesDto.GetDirectoryUsers getDirectories = new DirectoriesDto.GetDirectoryUsers(directoryUsers);
            getDirectoryUsersList.add(getDirectories);
        }

        return getDirectoryUsersList;
    }

    @Transactional(readOnly = true)
    public List<DirectoriesDto.GetParentDirectories> findParentDirectory (Long parentDirectoryId) {

        List<DirectoriesDto.GetParentDirectories> getDirectoriesList = new ArrayList<>();
        List<Directories> directoriesList = directoriesRepository.findByParentDirectoriesIdNum(parentDirectoryId);
        for (Directories directories : directoriesList) {
            DirectoriesDto.GetParentDirectories getDirectories = new DirectoriesDto.GetParentDirectories(directories);
            getDirectoriesList.add(getDirectories);
        }

        return getDirectoriesList;
    }

    @Transactional(readOnly = true)
    public List<DirectoriesDto.DirectoryUser> findAuthorityDirectoriesByUserId(Long userId) {
        return directoryUsersRepository.findAllByUsersIdNum(userId)
                .stream()
                .map(dirUser -> new DirectoriesDto.DirectoryUser(dirUser))
                .collect(Collectors.toList());
    }

//    @Transactional(readOnly = true)
//    public List<DirectoriesDto.GetDirectoryUsers> findDirectoryUsers(Long userId) {
//
//        List<DirectoriesDto.GetDirectoryUsers> getDirectoryUsersList = new ArrayList<>();
//        List<DirectoryUsers> directoryUsersList = directoryUsersRepository.findByUsers_IdNumAnd(userId);
//
//        for (DirectoryUsers directoryUsers : directoryUsersList) {
//            DirectoriesDto.GetDirectoryUsers getDirectories = new DirectoriesDto.GetDirectoryUsers(directoryUsers);
//            getDirectoryUsersList.add(getDirectories);
//        }
//
//        return getDirectoryUsersList;
//    }

}
